/**
 * Netlify serverless function: fetch financial news from public RSS feeds
 * and return JSON for the site's headlines widget.
 * Endpoint: /.netlify/functions/news
 */

const RSS_FEEDS = [
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC Business' },
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC World' }
];

function parseRssItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || block.match(/<title>(.*?)<\/title>/);
    const linkMatch = block.match(/<link>(.*?)<\/link>/);
    const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim() : '';
    const link = linkMatch ? linkMatch[1].trim() : '';
    if (title && link) items.push({ title, link });
  }
  return items;
}

exports.handler = async function (event, context) {
  const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
  const allowedList = (process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
  let allowOrigin = '*';
  if (allowedList.length) {
    allowOrigin = origin && allowedList.includes(origin) ? origin : allowedList[0];
  }
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

  const all = [];
  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'IIF-News-Widget/1.0' }
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = parseRssItems(xml).slice(0, 8).map(({ title, link }) => ({
        title,
        link,
        source: feed.name
      }));
      all.push(...items);
    } catch (e) {
      console.warn('RSS fetch failed:', feed.url, e.message);
    }
  }

  const uniqueByLink = [...new Map(all.map((i) => [i.link, i])).values()];
  const list = uniqueByLink.slice(0, 15);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ items: list })
  };
};
