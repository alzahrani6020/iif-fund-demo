const BAD_LEVELS = ['LIKELY', 'VERIFIED'];
const OFFENSIVE_WORDS = [
  'fuck', 'shit', 'bitch', 'cunt', 'dick', 'porn', 'nude', 'nazi', 'hitler',
  'شتيم', 'قذر', 'بذيء', 'فحش', 'عنصري'
];
const UNWANTED_SYMBOLS_OR_CODES = [
  '88', '14', '1488', 'swastika', 'nazi', 'ss runes', 'white power', 'wpww', 'hate',
  'تطرف', 'داعش', 'تنظيم', 'تكفير', 'إرهاب'
];
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(\+?[\d\s\-()]{10,20}|\b\d{10,15}\b|tel\s*:?\s*\d|whatsapp|واتساب|تليجرام|telegram)/i;

function normalizeForMatch(t) {
  if (!t || typeof t !== 'string') return '';
  return t.toLowerCase().replace(/\s+/g, ' ').trim();
}
function containsOffensiveOrUnwanted(text) {
  const normalized = normalizeForMatch(text);
  if (!normalized) return false;
  const combined = [...OFFENSIVE_WORDS, ...UNWANTED_SYMBOLS_OR_CODES];
  for (const term of combined) {
    const t = normalizeForMatch(term);
    if (!t) continue;
    if (normalized.includes(t)) return true;
    const asWord = new RegExp('\\b' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    if (asWord.test(normalized)) return true;
  }
  return false;
}
function containsContactInfo(text) {
  if (!text || typeof text !== 'string') return false;
  if (EMAIL_REGEX.test(text)) return true;
  if (PHONE_REGEX.test(text)) return true;
  return false;
}

async function checkWithVisionApi(base64, apiKey) {
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${encodeURIComponent(apiKey)}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [{
        image: { content: base64 },
        features: [
          { type: 'SAFE_SEARCH_DETECTION' },
          { type: 'TEXT_DETECTION', maxResults: 5 }
        ]
      }]
    })
  });
  if (!resp.ok) return { safe: true };
  const data = await resp.json();
  const first = data.responses && data.responses[0];
  if (first && first.error) return { safe: true };
  const ann = (first && first.safeSearchAnnotation) || {};
  const adult = (ann.adult || '').toUpperCase();
  const violence = (ann.violence || '').toUpperCase();
  const racy = (ann.racy || '').toUpperCase();
  if (BAD_LEVELS.includes(adult) || BAD_LEVELS.includes(violence) || BAD_LEVELS.includes(racy)) {
    return { safe: false, reason: 'nsfw' };
  }
  let fullText = '';
  if (first && first.textAnnotations && first.textAnnotations[0]) {
    fullText = (first.textAnnotations[0].description || '').replace(/\s+/g, ' ');
  }
  if (first && first.fullTextAnnotation && first.fullTextAnnotation.text) {
    fullText = (fullText + ' ' + first.fullTextAnnotation.text).replace(/\s+/g, ' ');
  }
  fullText = fullText.trim();
  if (fullText) {
    if (containsContactInfo(fullText)) return { safe: false, reason: 'contact' };
    if (containsOffensiveOrUnwanted(fullText)) return { safe: false, reason: 'text' };
  }
  return { safe: true };
}

module.exports = async (req, res) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  if (req.method === 'OPTIONS') { res.status(204).set(headers).send(''); return; }
  if (req.method !== 'POST') { res.status(405).set(headers).send(JSON.stringify({ safe: true, error: 'Method not allowed' })); return; }

  let body = req.body;
  if (!body) {
    try {
      body = JSON.parse(Buffer.from(await new Promise((resolve) => {
        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', () => resolve(Buffer.concat(chunks)));
      })).toString('utf8'));
    } catch (e) { body = null; }
  }
  const imageInput = body && body.image;
  if (!imageInput || typeof imageInput !== 'string') { res.status(200).set(headers).send(JSON.stringify({ safe: true })); return; }
  let base64 = imageInput.trim();
  const m = base64.match(/^data:image\/[^;]+;base64,(.+)$/);
  if (m) base64 = m[1];
  if (!/^[A-Za-z0-9+/=]+$/.test(base64) || base64.length < 100 || base64.length > 5 * 1024 * 1024) {
    res.status(200).set(headers).send(JSON.stringify({ safe: true })); return;
  }

  const apiKey = (process.env.GOOGLE_VISION_API_KEY || '').trim();
  if (apiKey) {
    try {
      const result = await checkWithVisionApi(base64, apiKey);
      res.status(200).set(headers).send(JSON.stringify(result)); return;
    } catch (e) { /* fallthrough */ }
  }
  res.status(200).set(headers).send(JSON.stringify({ safe: true }));
};
