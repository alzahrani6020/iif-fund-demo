import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import DictionaryEntry from '@/lib/models/DictionaryEntry'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await dbConnect()
    const entries = await DictionaryEntry.find().sort({ createdAt: -1 }).lean()
    return Response.json(entries)
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    await dbConnect()
    const entry = await DictionaryEntry.create({
      ...body,
      date: body.date || new Date().toISOString().slice(0, 10),
    })
    return Response.json(entry, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
