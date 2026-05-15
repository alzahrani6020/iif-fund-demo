import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import Poem from '@/lib/models/Poem'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await dbConnect()
    const poems = await Poem.find().sort({ createdAt: -1 }).lean()
    return Response.json(poems)
  } catch (error) {
    console.error('GET poems error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    await dbConnect()
    const poem = await Poem.create({
      ...body,
      date: body.date || new Date().toISOString().slice(0, 10),
      views: 0,
    })
    return Response.json(poem, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    console.error('POST poem error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
