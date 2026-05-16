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
const MAX_FILE_SIZE = 10 * 1024 * 1024;
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
  if (buffer[start] === 0x2d && buffer[start + 1] === 0x2d) return parts;
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

module.exports = async (req, res) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  if (req.method === 'OPTIONS') { res.status(204).set(headers).send(''); return; }
  if (req.method !== 'POST') { res.status(405).set(headers).send(JSON.stringify({ ok: false, error: 'Method not allowed' })); return; }

  let buffer;
  try {
    buffer = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });
  } catch (e) {
    res.status(400).set(headers).send(JSON.stringify({ ok: false, error: 'Invalid body' })); return;
  }

  const contentType = (req.headers['content-type'] || '').toString();
  const boundaryMatch = contentType.match(/boundary=([^;\s]+)/);
  const boundary = boundaryMatch ? boundaryMatch[1].trim().replace(/^["']|["']$/g, '') : null;
  if (!boundary) { res.status(400).set(headers).send(JSON.stringify({ ok: false, error: 'Missing multipart boundary' })); return; }

  const parts = parseMultipart(buffer, boundary);
  const filePart = parts.find(p => p.filename !== null && p.filename !== '');
  if (!filePart) { res.status(400).set(headers).send(JSON.stringify({ ok: false, error: 'No file in request' })); return; }

  if (!isFilenameSafe(filePart.filename)) { res.status(200).set(headers).send(JSON.stringify({ ok: false, error: 'Invalid or unsafe file name' })); return; }
  if (filePart.body.length > MAX_FILE_SIZE) { res.status(200).set(headers).send(JSON.stringify({ ok: false, error: 'File too large' })); return; }
  const mime = (filePart.contentType || '').toLowerCase().split(';')[0].trim();
  if (!ALLOWED_MIMES.includes(mime)) { res.status(200).set(headers).send(JSON.stringify({ ok: false, error: 'File type not allowed' })); return; }

  res.status(200).set(headers).send(JSON.stringify({ ok: true }));
};
