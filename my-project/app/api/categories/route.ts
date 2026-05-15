import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import Category from '@/lib/models/Category'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await dbConnect()
    const categories = await Category.find().sort({ createdAt: -1 }).lean()
    return Response.json(categories)
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    await dbConnect()
    const category = await Category.create(body)
    return Response.json(category, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
