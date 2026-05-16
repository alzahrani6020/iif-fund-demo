/**
 * فحص /api/news: لا نصوص قمامة MyMemory، واستجابة JSON صالحة.
 * الاستخدام: خادم يعمل على PORT (افتراضي 3333)، أو IIF_SMOKE_NEWS_BASE=https://…
 */
const PORT = Number(process.env.PORT) || 3333;
const HOST = process.env.CHECK_HOST || '127.0.0.1';
const BASE = (process.env.IIF_SMOKE_NEWS_BASE || '').trim() || `http://${HOST}:${PORT}`;

const PATHS = [
  '/api/news?lang=ar&cat=asian',
  '/api/news?lang=en&cat=asian',
  '/api/news?lang=ar&cat=arabic',
  '/api/news?lang=en&cat=arabic',
];

const JUNK = [
  'RFC3066',
  'LANGPAIR',
  'FC3066',
  'ALMOST ALL LANGUAGES',
  'ZH-CN',
  'MYMEMORY',
  'INVALID LANGPAIR',
];

async function main() {
  for (const p of PATHS) {
    const u = BASE.replace(/\/$/, '') + p;
    const res = await fetch(u, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${u}`);
    const text = await res.text();
    const up = text.toUpperCase();
    for (const bad of JUNK) {
      if (up.includes(bad)) throw new Error(`Substring "${bad}" in response from ${u}`);
    }
    let j;
    try {
      j = JSON.parse(text);
    } catch {
      throw new Error(`Not JSON: ${u}`);
    }
    if (!j || !Array.isArray(j.items)) throw new Error(`Missing items[]: ${u}`);
    if (j.items.length === 0) {
      console.warn(`smoke-news-api: warn — zero items ${u} (شبكة أو RSS مؤقتاً)`);
    } else {
      console.log(`smoke-news-api: ok ${j.items.length} items — ${u}`);
    }
  }
  console.log('smoke-news-api: all checks passed');
}

main().catch((e) => {
  console.error('smoke-news-api:', e.message || e);
  process.exit(1);
});
