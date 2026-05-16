import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me')

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('auth-token')?.value
    let isAdmin = false

    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        isAdmin = payload.role === 'admin'
      } catch {
        isAdmin = false
      }
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Protect API routes
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') && !pathname.startsWith('/api/comments')) {
    const token = request.cookies.get('auth-token')?.value
    let isAdmin = false

    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        isAdmin = payload.role === 'admin'
      } catch {
        isAdmin = false
      }
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
