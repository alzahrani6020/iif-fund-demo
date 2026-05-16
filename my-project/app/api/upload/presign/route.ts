import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { generatePresignedUrl } from '@/lib/r2'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const { filename, contentType } = await request.json()

    if (!filename || !contentType) {
      return Response.json({ error: 'filename and contentType are required' }, { status: 400 })
    }

    // Only allow video uploads
    if (!contentType.startsWith('video/')) {
      return Response.json({ error: 'Only video files are allowed' }, { status: 400 })
    }

    // Generate unique key
    const ext = filename.split('.').pop() || 'mp4'
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 10)
    const key = `videos/${timestamp}-${random}.${ext}`

    const { url, publicUrl } = await generatePresignedUrl(key, contentType, 300)

    return Response.json({ url, publicUrl, key })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return Response.json({ error: error.message }, { status: 401 })
    }
    console.error('Presign error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
