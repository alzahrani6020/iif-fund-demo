import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import Category from '@/lib/models/Category'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await dbConnect()
    const category = await Category.findById(id).lean()
    if (!category) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(category)
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
    const category = await Category.findByIdAndUpdate(id, body, { new: true }).lean()
    if (!category) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(category)
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
    await Category.findByIdAndDelete(id)
    return Response.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
