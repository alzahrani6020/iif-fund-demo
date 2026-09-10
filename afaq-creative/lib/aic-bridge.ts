// Shared AIC bridge runner for the /api/admin/aic/* secure gateways.
// The Next.js layer only validates action allowlists + input shape, then
// delegates to the Python bridge (aic_bridge.py gateway <action>), which in
// turn talks to the localhost AIC runtime. No client input ever reaches a
// shell; params travel to the bridge via stdin as JSON.
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

export const AIC_HOME = process.env.AIC_HOME
  ? path.resolve(process.env.AIC_HOME)
  : path.resolve(process.cwd(), 'platform', 'aic');
export const BRIDGE_SCRIPT = path.join(AIC_HOME, 'aic_bridge.py');
const PYTHON = process.env.AIC_PYTHON || 'python';
const BRIDGE_TIMEOUT_MS = 30_000;

export interface BridgeOutcome {
  ok: boolean;
  error?: string;
  data?: unknown;
}

export function runBridge(action: string, params: Record<string, unknown>): Promise<BridgeOutcome> {
  return new Promise((resolve) => {
    if (!fs.existsSync(BRIDGE_SCRIPT)) {
      resolve({ ok: false, error: `AIC bridge not found at ${BRIDGE_SCRIPT} (set AIC_HOME to override)` });
      return;
    }
    const child = spawn(PYTHON, [BRIDGE_SCRIPT, 'gateway', action], {
      cwd: AIC_HOME,
      env: process.env,
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolve({ ok: false, error: 'bridge timeout' });
    }, BRIDGE_TIMEOUT_MS);
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
      if (stdout.length > 2 * 1024 * 1024) child.kill('SIGKILL');
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ ok: false, error: err.message });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        let message = stderr.slice(0, 500) || `bridge exited with code ${code}`;
        try {
          const parsed = JSON.parse(stdout);
          if (parsed && typeof parsed.error === 'string') message = parsed.error;
        } catch {
          // keep stderr message
        }
        resolve({ ok: false, error: message });
        return;
      }
      try {
        const parsed = JSON.parse(stdout);
        if (parsed && parsed.success === false) {
          resolve({ ok: false, error: typeof parsed.error === 'string' ? parsed.error : 'bridge error' });
          return;
        }
        resolve({ ok: true, data: parsed?.data ?? parsed });
      } catch {
        resolve({ ok: false, error: `unparseable bridge output: ${stdout.slice(0, 200)}` });
      }
    });
    child.stdin.write(JSON.stringify(params ?? {}));
    child.stdin.end();
  });
}

// 4xx mapping shared by the gateways. Policy blocks from the runtime
// (CommandNotAllowed / WorkspaceBlocked) carry Arabic "محظور" messages —
// those surface as 403. Plain invalid input ("HTTP 400", "غير صالح", …)
// surfaces as 400. Anything else is a genuine gateway failure (502).
export function bridgeErrorStatus(error: string | undefined): number {
  const e = error || '';
  if (/محظور|محمي/.test(e)) return 403;
  return /invalid|required|too long|must be|HTTP 400|HTTP 404|غير صالح|غير مسموح|غير متاح|غير مدعوم/.test(e)
    ? (/HTTP 404/.test(e) ? 404 : 400)
    : 502;
}
