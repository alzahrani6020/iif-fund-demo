import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/lib/models/User'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    await dbConnect()
    const users = await User.find().sort({ createdAt: -1 }).lean()
    return Response.json(users)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
