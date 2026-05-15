import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }
    return Response.json({ user })
  } catch {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }
}
