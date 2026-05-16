/**
 * فحص اتصال بخلاصات RSS المستخدمة في api/news.js (HEAD ثم GET خفيف عند الحاجة).
 *   npm run check:news-feeds
 */
const FEEDS = [
  'https://feeds.bbci.co.uk/news/world/asia/rss.xml',
  'https://www.straitstimes.com/news/rss.xml',
  'https://www.caixin.com/rss/all.xml',
  'https://www.japantimes.co.jp/feed/topstories/',
  'https://www.cnbc.com/id/10001147/device/rss/rss.html',
  'https://www.bbc.com/arabic/index.xml',
  'https://www.aljazeera.net/rss',
  'https://www.aljazeera.com/xml/rss/all.xml',
  'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
  'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml',
];

async function checkOne(url) {
  try {
    const head = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'IIF-News-FeedCheck/1.0' } });
    if (head.ok) return { url, ok: true, status: head.status };
    const get = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'IIF-News-FeedCheck/1.0' } });
    return { url, ok: get.ok, status: get.status };
  } catch (e) {
    return { url, ok: false, error: e.message };
  }
}

async function main() {
  const results = [];
  for (const u of FEEDS) results.push(await checkOne(u));
  const okn = results.filter((r) => r.ok).length;
  for (const r of results) {
    console.log(r.ok ? `OK  ${r.status} ${r.url}` : `FAIL ${r.status || ''} ${r.url} ${r.error || ''}`);
  }
  if (okn === 0) {
    console.error('check-news-feeds: لا يوجد أي خلاصة تستجيب — تحقق من الشبكة أو الحظر');
    process.exit(1);
  }
  if (okn < FEEDS.length) {
    console.warn(`check-news-feeds: تحذير — ${FEEDS.length - okn} فشل، ${okn} نجح (جغرافياً/جدار ناري/تغيير URL)`);
  } else {
    console.log('check-news-feeds: كل الخلاصات المفحوصة استجابت');
  }
}

main();
