import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import User from '@/lib/models/User'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return Response.json({ error: 'Password is required' }, { status: 400 })
    }

    await dbConnect()

    // Find admin user or create default one
    let admin = await User.findOne({ role: 'admin' })

    if (!admin) {
      // Create default admin
      const hashedPassword = await bcrypt.hash('admin123', 10)
      admin = await User.create({
        name: 'Admin',
        email: 'admin@mzahrani.com',
        password: hashedPassword,
        role: 'admin',
      })
    }

    const isValid = await bcrypt.compare(password, admin.password)
    if (!isValid) {
      return Response.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = signToken({
      userId: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    })

    // Set cookie
    const response = Response.json({ success: true, user: { name: admin.name, role: admin.role } })
    response.headers.set('Set-Cookie', `auth-token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`)

    return response
  } catch (error) {
    console.error('Login error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
