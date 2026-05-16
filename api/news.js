const CORS_BASE = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
  'Access-Control-Expose-Headers': 'X-IIF-News-Item-Count, X-IIF-News-Empty'
};

function jsonNewsResponse(body, itemCount) {
  const n = Number(itemCount) || 0;
  const headers = {
    ...CORS_BASE,
    'X-IIF-News-Item-Count': String(n)
  };
  if (n === 0) headers['X-IIF-News-Empty'] = '1';
  return new Response(body, { status: 200, headers });
}

const ARABIC_SCRIPT = /[\u0600-\u06FF\u0750-\u077F]/;

/** إسقاط عناوين ترفيه/رياضة واضحة من شريطي asian / arabic */
function filterMarketTickerNoise(list, cat) {
  const c = String(cat || '').toLowerCase();
  if (c !== 'asian' && c !== 'arabic') return list;
  const noise =
    /\b(sports?|football|soccer|basketball|cricket|rugby|tennis|golf|celebrity|oscars?|grammy|tiktok|dating|horoscope|premier league|world cup|formula\s*1|\bf1\b|wwe|ufc|playoff|super bowl|concert tour|album drop)\b/i;
  return list.filter((it) => !noise.test(String(it.title || '')));
}

function getFeeds(targetLang, targetCat, targetCountry) {
  const FEEDS_EN = [
    { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC Business' },
    { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC World' },
    { url: 'https://feeds.reuters.com/reuters/businessNews', name: 'Reuters Business' },
    { url: 'https://feeds.reuters.com/reuters/worldNews', name: 'Reuters World' },
    { url: 'https://www.cnbc.com/id/10001147/device/rss/rss.html', name: 'CNBC World' }
  ];
  const FEEDS_AR = [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera (EN)' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ];
  const FEEDS_CN = [
    { url: 'https://www.straitstimes.com/news/rss.xml', name: 'Straits Times' },
    { url: 'https://www.caixin.com/rss/all.xml', name: 'Caixin Global' }
  ];
  /* أسواق فقط — مصادر اقتصادية/مالية دون أخبار عامة (موقع اقتصادي) */
  /* رويترز أغلق كثيراً من خلاصات RSS العامة — نعتمد BBC آسيا + مصادر إقليمية تعمل */
  const FEEDS_ASIAN_MARKETS = [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' },
    { url: 'https://www.straitstimes.com/news/rss.xml', name: 'Straits Times' },
    { url: 'https://www.caixin.com/rss/all.xml', name: 'Caixin Global' },
    { url: 'https://www.japantimes.co.jp/feed/topstories/', name: 'Japan Times' },
    { url: 'https://www.cnbc.com/id/10001147/device/rss/rss.html', name: 'CNBC' }
  ];
  /* أسواق عربية فقط — مصادر اقتصادية/مالية (مربوطة بالأسواق كالآسيوية) */
  const FEEDS_AR_MARKETS = [
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' },
    { url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', name: 'BBC Middle East' },
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' }
  ];
  if (targetCat === 'arabic') {
    if (targetCountry) {
      const countryFeeds = FEEDS_BY_COUNTRY[targetCountry];
      if (countryFeeds && countryFeeds.length) return [...countryFeeds, ...FEEDS_AR_MARKETS];
    }
    return FEEDS_AR_MARKETS;
  }
  if (targetCat === 'asian') {
    const countryFeeds = FEEDS_BY_ASIAN_COUNTRY[targetCountry];
    const core =
      countryFeeds && countryFeeds.length ? [...countryFeeds, ...FEEDS_ASIAN_MARKETS] : [...FEEDS_ASIAN_MARKETS];
    /* واجهة عربية: نخلط مصادر عربية (عناوين عربية فعلية) مع مصادر آسيوية الإنجليزية */
    if (targetLang === 'ar') {
      const FEEDS_ASIAN_AR_SUPPLEMENT = [
        { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' },
        { url: 'https://www.aljazeera.net/rss', name: 'الجزيرة نت' },
        { url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', name: 'BBC Middle East' }
      ];
      return [...FEEDS_ASIAN_AR_SUPPLEMENT, ...core];
    }
    return core;
  }
  if (targetCat === 'chinese') return FEEDS_CN;
  if (targetCat === 'global') return FEEDS_EN;
  if (targetCat === 'all') {
    if (targetLang === 'ar') return [...FEEDS_AR, ...FEEDS_EN, ...FEEDS_CN];
    return [...FEEDS_EN, ...FEEDS_CN];
  }
  if (targetLang === 'ar') return [...FEEDS_AR, ...FEEDS_EN, ...FEEDS_CN];
  return [...FEEDS_EN, ...FEEDS_CN];
}

const FEEDS_BY_COUNTRY = {
  SA: [
    { url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', name: 'BBC Middle East' },
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' }
  ],
  AE: [
    { url: 'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml', name: 'CNA' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  EG: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  QA: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' }
  ],
  KW: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  BH: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  OM: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  JO: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  MA: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  LB: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  IQ: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  TN: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  DZ: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  SD: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  YE: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  PS: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  SY: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  LY: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ],
  MR: [
    { url: 'https://www.aljazeera.net/rss', name: 'Al Jazeera' },
    { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
  ]
};

const FEEDS_BY_ASIAN_COUNTRY = {
  CN: [
    { url: 'https://www.straitstimes.com/news/rss.xml', name: 'Straits Times' },
    { url: 'https://www.caixin.com/rss/all.xml', name: 'Caixin Global' }
  ],
  JP: [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' },
    { url: 'https://feeds.reuters.com/reuters/INbusinessNews', name: 'Reuters' }
  ],
  IN: [
    { url: 'https://feeds.reuters.com/reuters/INbusinessNews', name: 'Reuters India' },
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' }
  ],
  KR: [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' },
    { url: 'https://feeds.reuters.com/reuters/worldNews', name: 'Reuters' }
  ],
  ID: [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' },
    { url: 'https://feeds.reuters.com/reuters/worldNews', name: 'Reuters' }
  ],
  MY: [
    { url: 'https://www.straitstimes.com/news/rss.xml', name: 'Straits Times' },
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' }
  ],
  TH: [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' },
    { url: 'https://feeds.reuters.com/reuters/worldNews', name: 'Reuters' }
  ],
  VN: [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' },
    { url: 'https://www.straitstimes.com/news/rss.xml', name: 'Straits Times' }
  ],
  PK: [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' },
    { url: 'https://feeds.reuters.com/reuters/worldNews', name: 'Reuters' }
  ],
  SG: [
    { url: 'https://www.straitstimes.com/news/rss.xml', name: 'Straits Times' },
    { url: 'https://feeds.reuters.com/reuters/worldNews', name: 'Reuters' }
  ],
  PH: [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' },
    { url: 'https://www.straitstimes.com/news/rss.xml', name: 'Straits Times' }
  ],
  BD: [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' },
    { url: 'https://feeds.reuters.com/reuters/worldNews', name: 'Reuters' }
  ],
  LK: [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' },
    { url: 'https://feeds.reuters.com/reuters/worldNews', name: 'Reuters' }
  ],
  MM: [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' },
    { url: 'https://www.straitstimes.com/news/rss.xml', name: 'Straits Times' }
  ],
  KH: [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC Asia' },
    { url: 'https://www.straitstimes.com/news/rss.xml', name: 'Straits Times' }
  ],
  TW: [
    { url: 'https://www.straitstimes.com/news/rss.xml', name: 'Straits Times' },
    { url: 'https://feeds.reuters.com/reuters/worldNews', name: 'Reuters' }
  ],
  HK: [
    { url: 'https://www.straitstimes.com/news/rss.xml', name: 'Straits Times' },
    { url: 'https://feeds.reuters.com/reuters/worldNews', name: 'Reuters' }
  ]
};

function parseRssItems(xml) {
  const items = [];
  const seen = new Set();

  function decodeXml(s) {
    return String(s || '')
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  function unescUrl(s) {
    return String(s || '').trim().replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  }

  function extractLink(block) {
    const href = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
    if (href && href[1]) return unescUrl(href[1]);
    const inner = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
    if (inner && inner[1].trim()) return unescUrl(decodeXml(inner[1]));
    const guid = block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i);
    if (guid) {
      const g = decodeXml(guid[1]);
      if (/^https?:\/\//i.test(g)) return g;
    }
    const id = block.match(/<id>([\s\S]*?)<\/id>/i);
    if (id) {
      const u = decodeXml(id[1]);
      if (/^https?:\/\//i.test(u)) return u;
    }
    return '';
  }

  function extractTitle(block) {
    const m =
      block.match(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) ||
      block.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return m ? decodeXml(m[1]) : '';
  }

  function parseBlock(block) {
    const title = extractTitle(block);
    const link = extractLink(block);
    if (!title || !link || !/^https?:\/\//i.test(link)) return;
    if (seen.has(link)) return;
    seen.add(link);
    items.push({ title, link });
  }

  let m;
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  while ((m = itemRe.exec(xml)) !== null) parseBlock(m[1]);
  const entryRe = /<entry>([\s\S]*?)<\/entry>/gi;
  while ((m = entryRe.exec(xml)) !== null) parseBlock(m[1]);

  return items;
}

/**
 * ترجمة عناوين إنجليزية → عربية عبر خدمة NLLB المحلية (نفس عقد /translate في search.html).
 * عيّن IIF_TICKER_TRANSLATE_URL كاملاً، مثلاً http://127.0.0.1:7071 — على Vercel غير مفعّل افتراضياً.
 */
async function translateEnglishTitlesForArabicUi(list) {
  const base = String(process.env.IIF_TICKER_TRANSLATE_URL || '').trim().replace(/\/$/, '');
  if (!base) return list;
  const maxN = Math.min(12, Math.max(1, Number(process.env.IIF_TICKER_TRANSLATE_MAX || 8)));
  const needIdx = [];
  for (let i = 0; i < list.length && needIdx.length < maxN; i++) {
    const t = String(list[i].title || '').trim();
    if (t && !ARABIC_SCRIPT.test(t)) needIdx.push(i);
  }
  if (!needIdx.length) return list;
  const texts = needIdx.map((i) => String(list[i].title).slice(0, 450));
  const timeoutMs = Number(process.env.IIF_TICKER_TRANSLATE_TIMEOUT_MS || 45000);
  try {
    const ac = new AbortController();
    const to = setTimeout(() => ac.abort(), timeoutMs);
    const r = await fetch(`${base}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: texts, target_lang: 'ar', source_lang: 'en' }),
      signal: ac.signal
    });
    clearTimeout(to);
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) return list;
    const out = Array.isArray(j.result) ? j.result : [];
    const next = list.map((it) => ({ ...it }));
    needIdx.forEach((idx, k) => {
      const tr = String(out[k] || '').trim();
      if (tr && tr.length > 1) next[idx] = { ...next[idx], arTranslation: tr };
    });
    return next;
  } catch {
    return list;
  }
}

/** تمييز بسيط: عناوين عربية vs إنجليزية لعرض مناسب في lang-en / lang-ar */
function annotateBilingualTitles(list) {
  return list.map((it) => {
    const t = String(it.title || '').trim();
    const arTr = String(it.arTranslation || '').trim();
    const base = { link: it.link, source: it.source };
    if (arTr) return { ...base, title: t, titleEn: t, titleAr: arTr };
    if (!t) return { ...base, title: t, titleEn: '', titleAr: '' };
    if (ARABIC_SCRIPT.test(t)) return { ...base, title: t, titleEn: '', titleAr: t };
    return { ...base, title: t, titleEn: t, titleAr: '' };
  });
}

const NEWS_CACHE_TTL_MS = Number(process.env.IIF_NEWS_CACHE_MS || 120000);
const newsResponseCache = new Map();

function newsCacheKey(targetLang, targetCat, targetCountry, rawLang) {
  const tr = String(process.env.IIF_TICKER_TRANSLATE_URL || '').trim() ? '1' : '0';
  const lk = String(rawLang || targetLang || 'en').toLowerCase();
  return `${lk}|${targetLang}|${targetCat}|${targetCountry || ''}|${tr}`;
}

export async function GET(request) {
  const url = new URL(request.url);
  const urlLang = url.searchParams.get('lang') || url.searchParams.get('l') || '';
  const urlCat = url.searchParams.get('cat') || url.searchParams.get('category') || '';
  const urlCountry = (url.searchParams.get('country') || '').toUpperCase().trim();
  const rawLang = String(urlLang || '').trim().toLowerCase();
  /* خلاصات RSS: عربي vs غير عربي؛ lang=fr|de|… يُعامل كإنجليزي لاختيار المصادر */
  const targetLang = rawLang === 'ar' ? 'ar' : 'en';
  const targetCat = (String(urlCat || '').toLowerCase()) || 'all';
  const targetCountry = urlCountry && /^[A-Z]{2}$/.test(urlCountry) ? urlCountry : '';

  const ck = newsCacheKey(targetLang, targetCat, targetCountry, rawLang);
  const now = Date.now();
  const hit = newsResponseCache.get(ck);
  if (hit && NEWS_CACHE_TTL_MS > 0 && now - hit.at < NEWS_CACHE_TTL_MS) {
    return jsonNewsResponse(hit.body, hit.count);
  }

  try {
    const all = [];
    const feeds = getFeeds(targetLang, targetCat, targetCountry);
    for (const feed of feeds) {
      try {
        const resp = await fetch(feed.url, { headers: { 'User-Agent': 'IIF-News-Widget/1.0' } });
        if (!resp.ok) continue;
        const xml = await resp.text();
        const items = parseRssItems(xml).slice(0, 8).map(({ title, link }) => ({ title, link, source: feed.name }));
        all.push(...items);
      } catch (e) { /* ignore */ }
    }
    const uniqueByLink = [...new Map(all.map((i) => [i.link, i])).values()];
    let list = uniqueByLink.slice(0, 15);
    list = filterMarketTickerNoise(list, targetCat);
    if (targetLang === 'ar') list = await translateEnglishTitlesForArabicUi(list);
    list = annotateBilingualTitles(list);
    const body = JSON.stringify({ items: list });
    if (NEWS_CACHE_TTL_MS > 0) {
      newsResponseCache.set(ck, { at: now, body, count: list.length });
    }
    return jsonNewsResponse(body, list.length);
  } catch (e) {
    return jsonNewsResponse(JSON.stringify({ items: [] }), 0);
  }
}
