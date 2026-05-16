/**
 * Netlify serverless function: server-side upload validation.
 * POST multipart/form-data with a single file; validates MIME (whitelist) and size.
 * Returns { ok: true } or { ok: false, error: "..." }.
 * Optional: add virus scanning (e.g. ClamAV or VirusTotal API) when a backend is available.
 * Endpoint: /.netlify/functions/validate-upload
 */

const ALLOWED_MIMES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.oasis.opendocument.text', 'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.oasis.opendocument.presentation',
  'text/plain', 'text/csv', 'application/rtf',
  'video/mp4', 'video/webm', 'video/quicktime',
  'audio/mpeg', 'audio/wav'
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const DANGEROUS_EXT = ['exe', 'bat', 'cmd', 'sh', 'ps1', 'php', 'phtml', 'js', 'vbs', 'scr', 'msi', 'jar', 'com', 'cgi', 'pl', 'py', 'rb', 'asp', 'aspx', 'jsp', 'svg', 'hta', 'reg', 'inf'];

function isFilenameSafe(filename) {
  if (!filename || typeof filename !== 'string' || filename.length > 200) return false;
  if (/[\x00-\x1f\\\/:"*?<>|]/.test(filename)) return false;
  if (/\.\./.test(filename)) return false;
  const ext = filename.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '');
  return ext && DANGEROUS_EXT.indexOf(ext) === -1;
}

function parseMultipart(buffer, boundary) {
  const parts = [];
  const sep = Buffer.from('\r\n\r\n');
  const b = Buffer.from('--' + boundary);
  let start = buffer.indexOf(b);
  if (start === -1) return parts;
  start += b.length;
  if (buffer[start] === 0x2d && buffer[start + 1] === 0x2d) return parts; // -- = end
  while (start < buffer.length) {
    const end = buffer.indexOf(b, start);
    const block = end === -1 ? buffer.subarray(start) : buffer.subarray(start, end);
    const headerEnd = block.indexOf(sep);
    if (headerEnd === -1) { start = end === -1 ? buffer.length : end + b.length; continue; }
    const headers = block.subarray(0, headerEnd).toString('latin1');
    const body = block.subarray(headerEnd + sep.length);
    const nameMatch = headers.match(/name="([^"]+)"/);
    const filenameMatch = headers.match(/filename="([^"]*)"/);
    const contentTypeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);
    const name = nameMatch ? nameMatch[1] : null;
    const filename = filenameMatch ? filenameMatch[1] : null;
    const contentType = contentTypeMatch ? contentTypeMatch[1].trim().toLowerCase() : null;
    if (name && (filename !== null || body.length)) parts.push({ name, filename, contentType, body });
    if (end === -1) break;
    start = end + b.length;
    if (buffer[start] === 0x2d && buffer[start + 1] === 0x2d) break;
  }
  return parts;
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
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }

  let buffer;
  try {
    buffer = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : Buffer.from(event.body || '', 'latin1');
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'Invalid body' }) };
  }

  const contentType = (event.headers['content-type'] || event.headers['Content-Type'] || '').toString();
  const boundaryMatch = contentType.match(/boundary=([^;\s]+)/);
  const boundary = boundaryMatch ? boundaryMatch[1].trim().replace(/^["']|["']$/g, '') : null;
  if (!boundary) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'Missing multipart boundary' }) };
  }

  const parts = parseMultipart(buffer, boundary);
  const filePart = parts.find(p => p.filename !== null && p.filename !== '');
  if (!filePart) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'No file in request' }) };
  }

  if (!isFilenameSafe(filePart.filename)) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'Invalid or unsafe file name' }) };
  }

  if (filePart.body.length > MAX_FILE_SIZE) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'File too large' }) };
  }
  const mime = (filePart.contentType || '').toLowerCase().split(';')[0].trim();
  if (!ALLOWED_MIMES.includes(mime)) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'File type not allowed' }) };
  }

  // Optional: add virus scanning here (e.g. ClamAV or VirusTotal API) when backend is available.
  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};
