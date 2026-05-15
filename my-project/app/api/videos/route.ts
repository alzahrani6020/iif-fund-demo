import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import Video from '@/lib/models/Video'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await dbConnect()
    const videos = await Video.find().sort({ createdAt: -1 }).lean()
    return Response.json(videos)
  } catch (error) {
    console.error('GET videos error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    await dbConnect()
    const video = await Video.create({
      ...body,
      date: body.date || new Date().toISOString().slice(0, 10),
      views: 0,
    })
    return Response.json(video, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    console.error('POST video error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
