import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, AdminSession } from './lib/session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = await getIronSession<AdminSession>(req, NextResponse.next(), sessionOptions);
    if (!session.isLoggedIn) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
