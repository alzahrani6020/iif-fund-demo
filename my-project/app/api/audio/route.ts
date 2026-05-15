import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import Audio from '@/lib/models/Audio'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await dbConnect()
    const audio = await Audio.find().sort({ createdAt: -1 }).lean()
    return Response.json(audio)
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    await dbConnect()
    const audio = await Audio.create({
      ...body,
      date: body.date || new Date().toISOString().slice(0, 10),
      views: 0,
    })
    return Response.json(audio, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
