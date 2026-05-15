import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import HistoryEvent from '@/lib/models/HistoryEvent'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await dbConnect()
    const events = await HistoryEvent.find().sort({ createdAt: -1 }).lean()
    return Response.json(events)
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    await dbConnect()
    const event = await HistoryEvent.create(body)
    return Response.json(event, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
