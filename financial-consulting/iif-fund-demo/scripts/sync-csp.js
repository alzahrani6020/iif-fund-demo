/**
 * Single source: config/content-security-policy.txt (one line).
 * Updates vercel.json, netlify.toml, and CSP <meta> in listed HTML (after <meta charset="utf-8" />).
 *
 *   npm run csp:sync
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const policyPath = path.join(root, 'config', 'content-security-policy.txt');
let policy = fs.readFileSync(policyPath, 'utf8').trim().replace(/\s+/g, ' ');
if (!policy) {
  console.error('[csp:sync] empty policy file');
  process.exit(1);
}

function htmlMetaLine() {
  const esc = policy.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return `  <meta http-equiv="Content-Security-Policy" content="${esc}" />\n`;
}

/* vercel.json */
const vercelPath = path.join(root, 'vercel.json');
const vercelRaw = fs.readFileSync(vercelPath, 'utf8').replace(/^\uFEFF/, '');
const vercel = JSON.parse(vercelRaw);
const block = vercel.headers && vercel.headers.find((h) => h.source === '/(.*)');
if (!block || !block.headers) {
  console.error('[csp:sync] vercel.json: missing /(.*) headers block');
  process.exit(1);
}
const cspHeader = block.headers.find((x) => x.key === 'Content-Security-Policy');
if (!cspHeader) {
  console.error('[csp:sync] vercel.json: no CSP header');
  process.exit(1);
}
cspHeader.value = policy;
fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2) + '\n', 'utf8');

/* netlify.toml */
const netlifyPath = path.join(root, 'netlify.toml');
let netlify = fs.readFileSync(netlifyPath, 'utf8');
const lines = netlify.split(/\r?\n/);
const cspIdx = lines.findIndex((l) => /^\s*Content-Security-Policy\s*=/.test(l));
if (cspIdx < 0) {
  console.warn('[csp:sync] netlify.toml: no Content-Security-Policy line');
} else {
  lines[cspIdx] = `    Content-Security-Policy = "${policy.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  fs.writeFileSync(netlifyPath, lines.join('\n'), 'utf8');
}

/* HTML */
const htmlFiles = ['index.html', 'admin-standalone.html', 'privacy.html', 'transparency.html', 'about-institution.html'];
const metaLine = htmlMetaLine();

for (const name of htmlFiles) {
  const p = path.join(root, name);
  if (!fs.existsSync(p)) continue;
  let html = fs.readFileSync(p, 'utf8');
  html = html.replace(/<meta\s+http-equiv=["']Content-Security-Policy["'][^>]*>\s*\r?\n?/gi, '');
  const replaced = html.replace(
    /(<meta\s+charset=["']utf-8["']\s*\/?>\s*\r?\n)/i,
    '$1' + metaLine
  );
  if (replaced === html) {
    console.warn('[csp:sync]', name, ': no charset=utf-8 anchor — CSP meta not inserted');
  } else {
    html = replaced;
  }
  fs.writeFileSync(p, html, 'utf8');
}

console.log('[csp:sync] OK — vercel.json, netlify.toml,', htmlFiles.join(', '));
