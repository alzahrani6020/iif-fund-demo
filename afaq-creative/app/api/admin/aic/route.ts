export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { requireAdmin, UnauthorizedError } from '@/lib/admin-auth';

const execFileAsync = promisify(execFile);

// AIC nucleus lives inside this afaq-creative project and is invoked
// in place (never copied into the web app). Override via env for other hosts.
const AIC_HOME = process.env.AIC_HOME
  ? path.resolve(process.env.AIC_HOME)
  : path.resolve(process.cwd(), 'platform', 'aic');
const BRIDGE_SCRIPT = path.join(AIC_HOME, 'aic_bridge.py');
const PYTHON = process.env.AIC_PYTHON || 'python';
const BRIDGE_TIMEOUT_MS = 15_000;

interface BridgeResult {
  ok: boolean;
  durationMs: number;
  error?: string;
  data?: unknown;
}

async function runBridge(): Promise<BridgeResult> {
  const started = Date.now();
  if (!fs.existsSync(BRIDGE_SCRIPT)) {
    return {
      ok: false,
      durationMs: 0,
      error: `AIC bridge not found at ${BRIDGE_SCRIPT} (set AIC_HOME to override)`,
    };
  }
  try {
    // Read-only contract: the only allowed invocation is the fixed "status"
    // subcommand. No client input ever reaches the child process.
    const { stdout } = await execFileAsync(PYTHON, [BRIDGE_SCRIPT, 'status'], {
      cwd: AIC_HOME,
      timeout: BRIDGE_TIMEOUT_MS,
      maxBuffer: 1024 * 1024,
      env: process.env,
      windowsHide: true,
    });
    return { ok: true, durationMs: Date.now() - started, data: JSON.parse(stdout) };
  } catch (error) {
    const message =
      error && typeof error === 'object' && 'stderr' in error && error.stderr
        ? String(error.stderr).slice(0, 500)
        : error instanceof Error
          ? error.message
          : String(error);
    return { ok: false, durationMs: Date.now() - started, error: message };
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const bridge = await runBridge();
    if (!bridge.ok) {
      return NextResponse.json({
        success: true,
        generatedAt: new Date().toISOString(),
        bridge: { ok: false, durationMs: bridge.durationMs, error: bridge.error },
        aic: null,
      });
    }
    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),
      bridge: { ok: true, durationMs: bridge.durationMs },
      aic: bridge.data,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : String(error);
    console.error('AIC status error:', message);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ.' },
      { status: 500 }
    );
  }
}
