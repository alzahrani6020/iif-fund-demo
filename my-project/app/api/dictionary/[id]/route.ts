import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import DictionaryEntry from '@/lib/models/DictionaryEntry'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await dbConnect()
    const entry = await DictionaryEntry.findById(id).lean()
    if (!entry) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(entry)
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
    const entry = await DictionaryEntry.findByIdAndUpdate(id, body, { new: true }).lean()
    if (!entry) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(entry)
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
    await DictionaryEntry.findByIdAndDelete(id)
    return Response.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
