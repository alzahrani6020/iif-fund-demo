import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import SiteConfig from '@/lib/models/SiteConfig'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await dbConnect()
    let config = await SiteConfig.findOne().lean()
    if (!config) {
      config = await SiteConfig.create({
        poetName: 'محمد عيضة الزهراني',
        poetSubtitle: 'شاعر وباحث في التراث',
      })
    }
    return Response.json(config)
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    await dbConnect()
    let config = await SiteConfig.findOne()
    if (!config) {
      config = await SiteConfig.create(body)
    } else {
      config = await SiteConfig.findByIdAndUpdate(config._id, body, { new: true }).lean()
    }
    return Response.json(config)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
