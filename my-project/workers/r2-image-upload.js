/**
 * Cloudflare Worker لرفع الصور على R2
 * 
 * كيفية الاستخدام:
 * 1. أنشئ R2 Bucket في Cloudflare Dashboard
 * 2. أنشئ Worker جديد وانسخ هذا الكود
 * 3. اربط Worker بـ Custom Domain: images.mzahrani.com
 * 4. أضف متغيرات البيئة: R2_BUCKET, R2_PUBLIC_URL
 */

export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://mzahrani.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders, status: 204 })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }

    try {
      const formData = await request.formData()
      const file = formData.get('file')

      if (!file || !(file instanceof File)) {
        return new Response(JSON.stringify({ error: 'No file provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        return new Response(JSON.stringify({ error: 'File must be an image' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'File too large (max 5MB)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Generate unique filename
      const ext = file.name.split('.').pop() || 'jpg'
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 10)
      const key = `uploads/${timestamp}-${random}.${ext}`

      // Upload to R2
      await env.R2_BUCKET.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type,
          cacheControl: 'public, max-age=31536000',
        },
      })

      // Return public URL
      const publicUrl = env.R2_PUBLIC_URL 
        ? `${env.R2_PUBLIC_URL}/${key}`
        : `https://${request.headers.get('host')}/${key}`

      return new Response(JSON.stringify({
        success: true,
        url: publicUrl,
        key: key,
        size: file.size,
        type: file.type,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  },
}
