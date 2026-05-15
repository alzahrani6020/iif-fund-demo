import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import Article from '@/lib/models/Article'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await dbConnect()
    const articles = await Article.find().sort({ createdAt: -1 }).lean()
    return Response.json(articles)
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    await dbConnect()
    const article = await Article.create({
      ...body,
      date: body.date || new Date().toISOString().slice(0, 10),
      views: 0,
    })
    return Response.json(article, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
