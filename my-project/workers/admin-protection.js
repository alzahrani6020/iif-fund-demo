/**
 * Worker لحماية /admin/ بـ Basic Auth
 * 
 * يعمل كـ reverse proxy للموقع الأصلي
 * Username: admin
 * Password: admin123 (افتراضي)
 */

const ADMIN_PASSWORD_HASH = "g10hvh"
const TARGET_URL = "https://mzahrani.pages.dev"

function hashPassword(password) {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

function parseBasicAuth(header) {
  const base64 = header.replace("Basic ", "")
  const decoded = atob(base64)
  const [user, pass] = decoded.split(":")
  return { user, pass }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    // فقط احمي /admin/
    if (!url.pathname.startsWith("/admin")) {
      // مرر الطلب للموقع الأصلي
      const target = new URL(url.pathname + url.search, TARGET_URL)
      const modified = new Request(target, request)
      return fetch(modified)
    }

    // استثناء static assets
    if (url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|woff|woff2|ico)$/)) {
      const target = new URL(url.pathname + url.search, TARGET_URL)
      return fetch(target)
    }

    const authHeader = request.headers.get("Authorization")
    
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return new Response(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head><title>لوحة التحكم - تسجيل الدخول</title></head>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#0a0a0a;font-family:system-ui;">
          <div style="text-align:center;color:#fff;">
            <h1>🔒 لوحة التحكم</h1>
            <p>اضغط Cancel وأعد المحاولة</p>
          </div>
        </body>
        </html>
      `, {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Panel"',
          "Content-Type": "text/html; charset=utf-8",
        },
      })
    }

    const { user, pass } = parseBasicAuth(authHeader)
    
    if (user !== "admin" || hashPassword(pass) !== ADMIN_PASSWORD_HASH) {
      return new Response("❌ كلمة المرور غير صحيحة", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Panel"',
          "Content-Type": "text/plain; charset=utf-8",
        },
      })
    }

    // صح! مرر الطلب للموقع الأصلي
    const target = new URL(url.pathname + url.search, TARGET_URL)
    const modified = new Request(target, request)
    return fetch(modified)
  },
}
