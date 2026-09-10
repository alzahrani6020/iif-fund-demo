export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { requireAdmin, UnauthorizedError } from '@/lib/admin-auth';

// Secure Gateway between /admin/aic and the AIC Developer Agent v2.
// The Next.js layer only validates the action allowlist + input shape, then
// delegates to the Python bridge (aic_bridge.py gateway <action>), which in
// turn talks to the localhost AIC runtime. No client input ever reaches a
// shell; params travel to the bridge via stdin as JSON.

const AIC_HOME = process.env.AIC_HOME
  ? path.resolve(process.env.AIC_HOME)
  : path.resolve(process.cwd(), 'platform', 'aic');
const BRIDGE_SCRIPT = path.join(AIC_HOME, 'aic_bridge.py');
const PYTHON = process.env.AIC_PYTHON || 'python';
const BRIDGE_TIMEOUT_MS = 30_000;

const ACTIONS = [
  'overview', 'task', 'submit', 'approve', 'reject', 'resume',
  'approvals', 'approval', 'decision', 'monitoring', 'audit',
  'incidents', 'incident', 'diagnose', 'propose_repair', 'scan_incidents',
  'models',
] as const;
type Action = (typeof ACTIONS)[number];

const TASK_ID_RE = /^[A-Za-z0-9-]{1,64}$/;
const MODEL_NAME_RE = /^[\w][\w.:/-]{0,99}$/;
// Server-side mirror of the runtime's supported per-task settings. Anything
// else is rejected here AND in the runtime (defense in depth) — a setting
// the provider cannot honor never reaches the model.
const TASK_SETTINGS: Record<string, { min: number; max: number }> = {
  max_tokens: { min: 256, max: 8192 },
  timeout: { min: 30, max: 900 },
};
const MAX_INSTRUCTION_CHARS = 2_000;
const MAX_REASON_CHARS = 500;

interface BridgeOutcome {
  ok: boolean;
  error?: string;
  data?: unknown;
}

function runBridge(action: Action, params: Record<string, unknown>): Promise<BridgeOutcome> {
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
    child.stdin.write(JSON.stringify(params));
    child.stdin.end();
  });
}

function isAction(value: unknown): value is Action {
  return typeof value === 'string' && (ACTIONS as readonly string[]).includes(value);
}

function sanitizeParams(action: Action, body: Record<string, unknown>): Record<string, unknown> | string {
  if (action === 'overview' || action === 'monitoring') return {};

  if (action === 'submit') {
    const instruction = typeof body.instruction === 'string' ? body.instruction.trim() : '';
    if (!instruction) return 'instruction is required';
    if (instruction.length > MAX_INSTRUCTION_CHARS) return `instruction too long (> ${MAX_INSTRUCTION_CHARS} chars)`;
    const params: Record<string, unknown> = { instruction };
    if (body.proposal !== undefined) {
      if (typeof body.proposal !== 'object' || body.proposal === null || Array.isArray(body.proposal)) {
        return 'proposal must be an object';
      }
      params.proposal = body.proposal;
    }
    if (body.model !== undefined) {
      if (typeof body.model !== 'string' || !MODEL_NAME_RE.test(body.model)) return 'invalid model name';
      params.model = body.model;
    }
    if (body.settings !== undefined) {
      if (typeof body.settings !== 'object' || body.settings === null || Array.isArray(body.settings)) {
        return 'settings must be an object';
      }
      const settings = body.settings as Record<string, unknown>;
      const keys = Object.keys(settings);
      if (keys.length > 8) return 'too many settings';
      for (const key of keys) {
        if (key === 'keep_alive') {
          if (typeof settings[key] !== 'string' || !/^(0|[1-9][0-9]{0,3}[smh])$/.test(settings[key] as string)) {
            return 'keep_alive must be 0 or a duration like 30s/15m/1h';
          }
          continue;
        }
        const spec = TASK_SETTINGS[key];
        if (!spec) return `unsupported setting: ${key}`;
        const value = settings[key];
        if (typeof value !== 'number' || !Number.isFinite(value) || value < spec.min || value > spec.max) {
          return `${key} out of range: ${spec.min}..${spec.max}`;
        }
      }
      params.settings = settings;
    }
    return params;
  }

  if (action === 'models') return {};

  if (action === 'approvals') {
    const params: Record<string, unknown> = {};
    if (body.status !== undefined) {
      if (typeof body.status !== 'string' || !['pending', 'approved', 'rejected', 'expired', 'cancelled'].includes(body.status)) {
        return 'invalid status';
      }
      params.status = body.status;
    }
    return params;
  }

  if (action === 'approval' || action === 'decision') {
    const approvalId = typeof body.approval_id === 'string' ? body.approval_id.trim() : '';
    if (!TASK_ID_RE.test(approvalId)) return 'invalid approval_id';
    if (action === 'approval') return { approval_id: approvalId };
    const decision = typeof body.decision === 'string' ? body.decision.trim() : '';
    if (decision !== 'approve' && decision !== 'reject') return 'decision must be approve or reject';
    const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, MAX_REASON_CHARS) : '';
    return { approval_id: approvalId, decision, reason };
  }

  if (action === 'audit') {
    const params: Record<string, unknown> = {};
    if (body.task_id !== undefined) {
      const taskId = typeof body.task_id === 'string' ? body.task_id.trim() : '';
      if (!TASK_ID_RE.test(taskId)) return 'invalid task_id';
      params.task_id = taskId;
    }
    if (body.limit !== undefined) {
      const limit = Number(body.limit);
      if (!Number.isInteger(limit) || limit < 1 || limit > 1000) return 'invalid limit';
      params.limit = limit;
    }
    return params;
  }

  if (action === 'incidents') {
    const params: Record<string, unknown> = {};
    if (body.status !== undefined) {
      if (typeof body.status !== 'string' || !['open', 'diagnosing', 'repair_pending_approval', 'repairing', 'repair_failed', 'needs_human', 'resolved', 'no_action'].includes(body.status)) {
        return 'invalid status';
      }
      params.status = body.status;
    }
    if (body.classification !== undefined) {
      if (typeof body.classification !== 'string' || !/^[a-z_]{1,40}$/.test(body.classification)) {
        return 'invalid classification';
      }
      params.classification = body.classification;
    }
    return params;
  }

  if (action === 'incident' || action === 'diagnose') {
    const incidentId = typeof body.incident_id === 'string' ? body.incident_id.trim() : '';
    if (!TASK_ID_RE.test(incidentId)) return 'invalid incident_id';
    return { incident_id: incidentId };
  }

  if (action === 'propose_repair') {
    const incidentId = typeof body.incident_id === 'string' ? body.incident_id.trim() : '';
    if (!TASK_ID_RE.test(incidentId)) return 'invalid incident_id';
    const params: Record<string, unknown> = { incident_id: incidentId };
    if (body.proposal !== undefined) {
      if (typeof body.proposal !== 'object' || body.proposal === null || Array.isArray(body.proposal)) {
        return 'proposal must be an object';
      }
      params.proposal = body.proposal;
    }
    return params;
  }

  if (action === 'scan_incidents') {
    return {};
  }

  const taskId = typeof body.task_id === 'string' ? body.task_id.trim() : '';
  if (!TASK_ID_RE.test(taskId)) return 'invalid task_id';
  const params: Record<string, unknown> = { task_id: taskId };
  if (action === 'approve' || action === 'reject') {
    params.reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, MAX_REASON_CHARS) : '';
  }
  return params;
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const taskId = req.nextUrl.searchParams.get('task');
    const outcome = await runBridge(taskId ? 'task' : 'overview', taskId ? { task_id: taskId } : {});
    if (!outcome.ok) {
      if (/invalid task_id/.test(outcome.error || '')) {
        return NextResponse.json({ success: false, message: 'معرّف مهمة غير صالح' }, { status: 400 });
      }
      return NextResponse.json({ success: false, message: outcome.error || 'AIC gateway error' }, { status: 502 });
    }
    return NextResponse.json({ success: true, data: outcome.data });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : String(error);
    console.error('AIC developer gateway error:', message);
    return NextResponse.json({ success: false, message: 'حدث خطأ.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: 'JSON غير صالح' }, { status: 400 });
    }
    const action = body.action;
    if (!isAction(action)) {
      return NextResponse.json({ success: false, message: 'إجراء غير مسموح' }, { status: 400 });
    }
    const params = sanitizeParams(action, body);
    if (typeof params === 'string') {
      return NextResponse.json({ success: false, message: params }, { status: 400 });
    }
    // Actor identity is derived server-side from the admin session only.
    // Client-supplied actor values are ignored entirely (anti-spoofing).
    if (action === 'submit' || action === 'approve' || action === 'reject'
        || action === 'resume' || action === 'decision'
        || action === 'diagnose' || action === 'propose_repair' || action === 'scan_incidents') {
      params.actor = admin.email;
    }
    const outcome = await runBridge(action, params);
    if (!outcome.ok) {
      // "runtime HTTP 400 ..." is the bridge forwarding a client-rejection
      // from the runtime (unknown model, bad setting, invalid payload) — it
      // must surface as 400, not as a gateway 502.
      const status = /invalid|required|too long|must be|HTTP 400/.test(outcome.error || '') ? 400 : 502;
      return NextResponse.json({ success: false, message: outcome.error || 'AIC gateway error' }, { status });
    }
    return NextResponse.json({ success: true, data: outcome.data });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : String(error);
    console.error('AIC developer gateway error:', message);
    return NextResponse.json({ success: false, message: 'حدث خطأ.' }, { status: 500 });
  }
}
