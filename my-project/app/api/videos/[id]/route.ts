import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import Video from '@/lib/models/Video'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await dbConnect()
    const video = await Video.findById(id).lean()
    if (!video) {
      return Response.json({ error: 'Video not found' }, { status: 404 })
    }
    return Response.json(video)
  } catch (error) {
    console.error('GET video error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()
    await dbConnect()
    const video = await Video.findByIdAndUpdate(id, body, { new: true }).lean()
    if (!video) {
      return Response.json({ error: 'Video not found' }, { status: 404 })
    }
    return Response.json(video)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    console.error('PUT video error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await dbConnect()
    const video = await Video.findByIdAndDelete(id).lean()
    if (!video) {
      return Response.json({ error: 'Video not found' }, { status: 404 })
    }
    return Response.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    console.error('DELETE video error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
