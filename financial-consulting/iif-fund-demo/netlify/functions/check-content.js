/**
 * Netlify serverless function: content moderation.
 * - NSFW (Safe Search)
 * - Offensive/vulgar text, extremist or globally unwanted symbols
 * - Email / phone in image
 * POST JSON body: { image: "data:image/...;base64,..." or "base64..." }
 * Returns { safe: true } or { safe: false, reason: "nsfw"|"text"|"contact" }.
 * Uses Google Cloud Vision API when GOOGLE_VISION_API_KEY is set.
 * Endpoint: /.netlify/functions/check-content
 */

const VISION_URL = 'https://vision.googleapis.com/v1/images:annotate';
const BAD_LEVELS = ['LIKELY', 'VERIFIED'];

/* كلمات بذيئة أو مسيئة — قائمة مختصرة؛ يمكن توسيعها حسب سياسة الموقع */
const OFFENSIVE_WORDS = [
  'fuck', 'shit', 'bitch', 'cunt', 'dick', 'porn', 'nude', 'nazi', 'hitler',
  'شتيم', 'قذر', 'بذيء', 'فحش', 'عنصري'
];
/* رموز أو نصوص تدل على تطرف أو كراهية أو شعارات غير مرغوب فيها عالمياً — يمكن توسيعها */
const UNWANTED_SYMBOLS_OR_CODES = [
  '88', '14', '1488', 'swastika', 'nazi', 'ss runes', 'white power', 'wpww', 'hate',
  'تطرف', 'داعش', 'تنظيم', 'تكفير', 'إرهاب'
];
/* ملاحظة: كشف "صور مشوهة لشخصيات عالمية" يتطلب نموذجاً متخصصاً أو مراجعة يدوية؛ يمكن إضافتها لاحقاً */

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(\+?[\d\s\-()]{10,20}|\b\d{10,15}\b|tel\s*:?\s*\d|whatsapp|واتساب|تليجرام|telegram)/i;

function parseBody(event) {
  const body = event.body || '';
  if (event.isBase64Encoded) {
    try {
      return JSON.parse(Buffer.from(body, 'base64').toString('utf8'));
    } catch (e) {
      return null;
    }
  }
  try {
    return typeof body === 'string' ? JSON.parse(body) : body;
  } catch (e) {
    return null;
  }
}

function extractBase64(imageInput) {
  if (!imageInput || typeof imageInput !== 'string') return null;
  const s = imageInput.trim();
  const dataMatch = s.match(/^data:image\/[^;]+;base64,(.+)$/);
  if (dataMatch) return dataMatch[1];
  if (/^[A-Za-z0-9+/=]+$/.test(s) && s.length > 100) return s;
  return null;
}

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
  const res = await fetch(`${VISION_URL}?key=${encodeURIComponent(apiKey)}`, {
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
  if (!res.ok) {
    const errText = await res.text();
    console.error('Vision API error:', res.status, errText);
    return { safe: true };
  }
  const data = await res.json();
  const first = data.responses && data.responses[0];
  const err = first && first.error;
  if (err) {
    console.error('Vision API response error:', err);
    return { safe: true };
  }

  const ann = (first && first.safeSearchAnnotation) || {};
  const adult = (ann.adult || '').toUpperCase();
  const violence = (ann.violence || '').toUpperCase();
  const racy = (ann.racy || '').toUpperCase();
  if (BAD_LEVELS.includes(adult) || BAD_LEVELS.includes(violence) || BAD_LEVELS.includes(racy)) {
    return { safe: false, reason: 'nsfw' };
  }

  let fullText = '';
  if (first.textAnnotations && first.textAnnotations[0]) {
    fullText = (first.textAnnotations[0].description || '').replace(/\s+/g, ' ');
  }
  if (first.fullTextAnnotation && first.fullTextAnnotation.text) {
    fullText = (fullText + ' ' + first.fullTextAnnotation.text).replace(/\s+/g, ' ');
  }
  fullText = fullText.trim();
  if (fullText) {
    if (containsContactInfo(fullText)) return { safe: false, reason: 'contact' };
    if (containsOffensiveOrUnwanted(fullText)) return { safe: false, reason: 'text' };
  }

  return { safe: true };
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
    'Vary': 'Origin'
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ safe: true, error: 'Method not allowed' }) };
  }

  const body = parseBody(event);
  const imageInput = body && body.image;
  const base64 = extractBase64(imageInput);
  if (!base64 || base64.length > 5 * 1024 * 1024) {
    return { statusCode: 200, headers, body: JSON.stringify({ safe: true }) };
  }

  const apiKey = (process.env.GOOGLE_VISION_API_KEY || '').trim();
  if (apiKey) {
    try {
      const result = await checkWithVisionApi(base64, apiKey);
      return { statusCode: 200, headers, body: JSON.stringify(result) };
    } catch (e) {
      console.error('check-content error:', e);
    }
  }
  return { statusCode: 200, headers, body: JSON.stringify({ safe: true }) };
};
