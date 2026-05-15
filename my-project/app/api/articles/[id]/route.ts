import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import Article from '@/lib/models/Article'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await dbConnect()
    const article = await Article.findById(id).lean()
    if (!article) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(article)
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
    const article = await Article.findByIdAndUpdate(id, body, { new: true }).lean()
    if (!article) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(article)
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
    await Article.findByIdAndDelete(id)
    return Response.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
