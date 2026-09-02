export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { destroyAdminSession } from '@/lib/auth';
import { requireAdmin, UnauthorizedError } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await destroyAdminSession();
    return NextResponse.json({ success: true, message: 'تم تسجيل الخروج بنجاح.' });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : String(error);
    console.error('Admin logout error:', message);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تسجيل الخروج.' },
      { status: 500 }
    );
  }
}
