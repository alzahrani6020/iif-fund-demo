import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import Comment from '@/lib/models/Comment'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await dbConnect()
    const comments = await Comment.find().sort({ createdAt: -1 }).lean()
    return Response.json(comments)
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await dbConnect()
    const comment = await Comment.create({
      ...body,
      date: body.date || new Date().toISOString().slice(0, 10),
      status: 'pending',
    })
    return Response.json(comment, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
