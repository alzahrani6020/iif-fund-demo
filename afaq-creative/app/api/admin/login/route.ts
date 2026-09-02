export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminCredentials, setAdminSession } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/admin-auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (!checkRateLimit(`admin-login:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { success: false, message: 'تم تجاوز عدد المحاولات المسموح بها. حاول لاحقاً.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const sessionData = await verifyAdminCredentials(email, password);
    if (!sessionData) {
      return NextResponse.json(
        { success: false, message: 'بيانات الدخول غير صحيحة.' },
        { status: 401 }
      );
    }

    await setAdminSession(sessionData);

    return NextResponse.json({
      success: true,
      admin: { id: sessionData.id, email: sessionData.email, name: sessionData.name, role: sessionData.role },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Admin login error:', message);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تسجيل الدخول.' },
      { status: 500 }
    );
  }
}
