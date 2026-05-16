/**
 * يتحقق من أن SearXNG يستجيب على SEARXNG_URL.
 * محليًا: http://127.0.0.1:18080 (Docker من engines/searxng)
 * إنتاجًا: https://search.example.com
 * الاستخدام: npm run verify:searx
 */
'use strict';

const http = require('http');
const https = require('https');
const { URL } = require('url');

const DEFAULT = 'http://127.0.0.1:18080';
const base = process.env.SEARXNG_URL || DEFAULT;
let u;
try {
  u = new URL(base);
} catch {
  console.error('SEARXNG_URL غير صالح:', base);
  process.exit(1);
}

const isHttps = u.protocol === 'https:';
const mod = isHttps ? https : http;
const port = u.port ? Number(u.port) : isHttps ? 443 : 80;

function probe(path) {
  return new Promise((resolve, reject) => {
    const req = mod.request(
      {
        hostname: u.hostname,
        port,
        path,
        method: 'GET',
        timeout: 10000,
        servername: isHttps ? u.hostname : undefined,
      },
      (res) => {
        res.resume();
        resolve(res.statusCode);
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
    req.end();
  });
}

(async () => {
  try {
    const code = await probe('/');
    console.log('OK  SearXNG على ' + base + ' — HTTP ' + code);
    process.exit(0);
  } catch (e) {
    console.error('FAIL  لا يوجد رد من SearXNG على ' + base);
    console.error('      ' + (e && e.message ? e.message : e));
    if (base.includes('127.0.0.1') || base.includes('localhost')) {
      console.error('      شغّل: cd engines/searxng  ثم  docker compose up -d');
    } else {
      console.error('      تحقق من النطاق وCaddy/Nginx والـ HTTPS على الـ VPS.');
    }
    process.exit(1);
  }
})();
