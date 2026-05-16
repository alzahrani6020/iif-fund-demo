import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import Proverb from '@/lib/models/Proverb'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await dbConnect()
    const proverbs = await Proverb.find().sort({ createdAt: -1 }).lean()
    return Response.json(proverbs)
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    await dbConnect()
    const proverb = await Proverb.create({
      ...body,
      date: body.date || new Date().toISOString().slice(0, 10),
    })
    return Response.json(proverb, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
