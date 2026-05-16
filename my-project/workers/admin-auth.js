/**
 * Worker لحماية /admin/ بـ Basic Auth
 * 
 * Username: admin
 * Password: (اللي تبيه)
 * 
 * للتغيير: عدل المتغير ADMIN_PASSWORD
 */

const ADMIN_PASSWORD_HASH = "g10hvh" // hash of "admin123" (نفس نظام الأدمن)

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
      return fetch(request)
    }

    // استثناء static assets (CSS, JS, images)
    if (url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|woff|woff2)$/)) {
      return fetch(request)
    }

    const authHeader = request.headers.get("Authorization")
    
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Panel"',
          "Content-Type": "text/plain; charset=utf-8",
        },
      })
    }

    const { user, pass } = parseBasicAuth(authHeader)
    
    if (user !== "admin" || hashPassword(pass) !== ADMIN_PASSWORD_HASH) {
      return new Response("Invalid credentials", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Panel"',
          "Content-Type": "text/plain; charset=utf-8",
        },
      })
    }

    // صح! مرر الطلب
    return fetch(request)
  },
}
