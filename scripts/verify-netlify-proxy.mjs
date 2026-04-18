/**
 * يتحقق من أن موقع Netlify (أو أي نشر يوفّر /api/searx) يمرّر الطلبات للمحرك.
 * إن ظهر 501 فالمتغير غير متاح للدالة؛ راجع `netlify.toml` ولوحة Netlify. الدالة تستخدم tiekoetter افتراضياً عند غياب القيمة.
 *
 * الاستخدام:
 *   set PROXY_BASE=https://yoursite.netlify.app
 *   npm run verify:proxy
 */
const raw = (process.env.PROXY_BASE || '').trim().replace(/\/+$/, '');
if (!raw) {
  console.log('SKIP  لم يُضبط PROXY_BASE.');
  console.log('      مثال (PowerShell): $env:PROXY_BASE="https://yoursite.netlify.app"; npm run verify:proxy');
  process.exit(0);
}

let base;
try {
  base = new URL(raw);
} catch {
  console.error('FAIL  PROXY_BASE غير صالح:', raw);
  process.exit(1);
}

const searchUrl = new URL('/api/searx/search?q=iif', base);
const timeoutMs = Number(process.env.IIF_PROXY_VERIFY_MS || 20000);

try {
  const res = await fetch(searchUrl, {
    method: 'GET',
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
    headers: { Accept: 'application/json,text/html;q=0.9,*/*;q=0.8' },
  });
  const status = res.status;
  if (status === 501) {
    console.error('FAIL  البروكسي يعمل لكن SearXNG غير مضبوط (501).');
    console.error('      في Netlify: أضف SEARXNG_URL=https://نطاق-المحرك  ثم أعد النشر.');
    process.exit(1);
  }
  if (status >= 500) {
    console.error('FAIL  البروكسي أعاد', status, '— تحقق من SEARXNG_URL والمحرك على الـ VPS.');
    process.exit(1);
  }
  if (status >= 400) {
    console.error('FAIL  طلب غير متوقع:', status, searchUrl.href);
    process.exit(1);
  }
  console.log('OK  البروكسي على', base.origin, '— /api/searx/search → HTTP', status);
  process.exit(0);
} catch (e) {
  console.error('FAIL  لا يمكن الوصول إلى', searchUrl.href);
  console.error('      ' + (e && e.message ? e.message : e));
  process.exit(1);
}
