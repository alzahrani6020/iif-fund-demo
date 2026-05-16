import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import Poem from '@/lib/models/Poem'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await dbConnect()
    const poem = await Poem.findById(id).lean()
    if (!poem) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(poem)
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()
    await dbConnect()
    const poem = await Poem.findByIdAndUpdate(id, body, { new: true }).lean()
    if (!poem) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(poem)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await dbConnect()
    await Poem.findByIdAndDelete(id)
    return Response.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
