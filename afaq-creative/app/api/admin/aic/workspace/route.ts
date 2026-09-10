export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, UnauthorizedError } from '@/lib/admin-auth';
import { runBridge, bridgeErrorStatus } from '@/lib/aic-bridge';

// Secure Gateway for the AIC Code Workspace surface (file tree, safe file
// ops, project search, runtime detection, allowlisted commands, read-only
// git). Same trust model as the developer gateway: session-checked admin,
// input shape validated here, authoritative policy enforcement in the
// runtime (ProjectBoundary + command allowlist + audit ledger).

const WS_OPS = ['tree', 'files', 'read', 'write', 'fs', 'search', 'detect', 'run', 'git'] as const;
type WsOp = (typeof WS_OPS)[number];

const MAX_PATH_LEN = 512;
const MAX_CONTENT_BYTES = 512 * 1024;
const MAX_QUERY_LEN = 300;
const MAX_COMMAND_LEN = 600;

function sanitize(op: string, body: Record<string, unknown>): Record<string, unknown> | string {
  const str = (v: unknown, max: number, label: string): string | null =>
    typeof v === 'string' && v.length <= max && !v.includes('\0') ? v : null;

  // Optional workspace root override (E2E fixtures / secondary projects).
  // Validated server-side in the runtime against AIC_DEV_ALLOWED_ROOTS.
  let root: string | undefined;
  if (body.root !== undefined && body.root !== null && body.root !== '') {
    const r = str(body.root, MAX_PATH_LEN, 'root');
    if (r === null) return 'root غير صالح';
    root = r;
  }
  const withRoot = (out: Record<string, unknown>): Record<string, unknown> =>
    root ? { ...out, root } : out;

  switch (op as WsOp) {
    case 'tree': {
      const path = str(body.path ?? '', MAX_PATH_LEN, 'path');
      if (path === null) return 'مسار غير صالح';
      return withRoot({ op, path });
    }
    case 'files':
      return withRoot({ op });
    case 'read': {
      const path = str(body.path, MAX_PATH_LEN, 'path');
      if (!path) return 'مسار غير صالح';
      return withRoot({ op, path });
    }
    case 'write': {
      const path = str(body.path, MAX_PATH_LEN, 'path');
      const content = body.content;
      if (!path) return 'مسار غير صالح';
      if (typeof content !== 'string' || Buffer.byteLength(content, 'utf-8') > MAX_CONTENT_BYTES) {
        return 'محتوى غير صالح';
      }
      return withRoot({ op, path, content });
    }
    case 'fs': {
      const fsop = body.fsop;
      if (fsop !== 'mkdir' && fsop !== 'rename' && fsop !== 'delete') return 'عملية غير مسموحة';
      const path = str(body.path, MAX_PATH_LEN, 'path');
      if (!path) return 'مسار غير صالح';
      const out: Record<string, unknown> = { op, fsop, path };
      if (fsop === 'rename') {
        const newPath = str(body.new_path, MAX_PATH_LEN, 'new_path');
        if (!newPath) return 'مسار الوجهة غير صالح';
        out.new_path = newPath;
      }
      return withRoot(out);
    }
    case 'search': {
      const q = str(body.q, MAX_QUERY_LEN, 'q');
      if (!q) return 'كلمة بحث غير صالحة';
      return withRoot({ op, q, regex: body.regex === true });
    }
    case 'detect':
      return withRoot({ op });
    case 'git': {
      const what = body.what;
      if (what !== 'status' && what !== 'diff' && what !== 'log') return 'عملية git غير مسموحة';
      return withRoot({ op, what });
    }
    case 'run': {
      const command = str(body.command, MAX_COMMAND_LEN, 'command');
      if (!command || !command.trim()) return 'أمر غير صالح';
      const out: Record<string, unknown> = { op, command };
      if (body.timeout !== undefined) {
        const timeout = Number(body.timeout);
        if (!Number.isInteger(timeout) || timeout < 5 || timeout > 600) return 'timeout غير صالح';
        out.timeout = timeout;
      }
      return withRoot(out);
    }
    default:
      return 'عملية غير مسموحة';
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const op = request.nextUrl.searchParams.get('op') ?? 'tree';
    const params: Record<string, unknown> = { op };
    for (const key of ['path', 'q', 'what', 'root']) {
      const value = request.nextUrl.searchParams.get(key);
      if (value !== null) params[key] = value;
    }
    if (request.nextUrl.searchParams.get('regex') === '1') params.regex = true;
    const sanitized = sanitize(op, params);
    if (typeof sanitized === 'string') {
      return NextResponse.json({ success: false, message: sanitized }, { status: 400 });
    }
    const outcome = await runBridge('ws', sanitized);
    if (!outcome.ok) {
      return NextResponse.json(
        { success: false, message: outcome.error || 'AIC gateway error' },
        { status: bridgeErrorStatus(outcome.error) },
      );
    }
    return NextResponse.json({ success: true, data: outcome.data });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: 'حدث خطأ.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'JSON غير صالح' }, { status: 400 });
    }
    const op = typeof body.op === 'string' ? body.op : '';
    if (!WS_OPS.includes(op as WsOp)) {
      return NextResponse.json({ success: false, message: 'عملية غير مسموحة' }, { status: 400 });
    }
    const sanitized = sanitize(op, body);
    if (typeof sanitized === 'string') {
      return NextResponse.json({ success: false, message: sanitized }, { status: 400 });
    }
    // Mutating ops are attributed to the admin session server-side.
    if (op === 'write' || op === 'fs' || op === 'run') {
      sanitized.actor = admin.email;
    }
    const outcome = await runBridge('ws', sanitized);
    if (!outcome.ok) {
      return NextResponse.json(
        { success: false, message: outcome.error || 'AIC gateway error' },
        { status: bridgeErrorStatus(outcome.error) },
      );
    }
    return NextResponse.json({ success: true, data: outcome.data });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: 'حدث خطأ.' }, { status: 500 });
  }
}
