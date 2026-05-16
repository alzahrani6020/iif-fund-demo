/**
 * تحقق أن خادم التطوير يقدّم الصفحات (شغّل بعد: npm start)
 * الاستخدام: npm run check-urls
 * المسارات الحرجة: الجذر، iif-fund-demo، fund-site، المنصة الحكومية، iif-config.js
 */
'use strict';

const http = require('http');

const HOST = process.env.CHECK_HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 3333;

const PATHS = [
  '/',
  '/start-here.html',
  '/health.html',
  '/connect.html',
  '/analysis.html',
  '/diagnostics.html',
  '/executive-brief.html',
  '/executive',
  '/sovereign-standards.html',
  '/sovereign',
  '/charter',
  '/financial-consulting/iif-fund-demo/index.html',
  '/financial-consulting/fund-site/index.html',
  '/financial-consulting/government-search/SIMPLE-GOVERNMENT-PLATFORM.html',
  '/financial-consulting/government-search/iif-config.js',
  '/legal/index.html',
  '/legal/privacy.html',
  '/legal/disclaimer.html',
  '/legal/contact.html',
  '/assets/og-cover.svg',
  '/financial-consulting/iif-fund-demo/assets/emblem.jpg',
];

/** مسارات اختيارية: فشلها لا يوقف السكربت (مثلاً SearXNG غير مشغّل) */
const SOFT_PATHS = [{ path: '/api/searx/', note: 'بروكسي → SearXNG على 127.0.0.1:18080 (Docker من engines/searxng)' }];
const CHECK_OPTIONAL = process.env.CHECK_OPTIONAL === '1';

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: HOST, port: PORT, path, method: 'GET', timeout: 10000 },
      (res) => {
        res.resume();
        resolve({ path, status: res.statusCode });
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

async function main() {
  console.log('التحقق من http://' + HOST + ':' + PORT + ' (شغّل npm start أولاً)\n');
  let failed = false;
  for (const p of PATHS) {
    try {
      const { status } = await get(p);
      if (status === 200) {
        console.log('  OK', status, p);
      } else {
        console.log('  BAD', status, p);
        failed = true;
      }
    } catch (e) {
      console.log('  FAIL', p, '—', e.message);
      failed = true;
    }
  }

  console.log('');
  if (CHECK_OPTIONAL) {
    console.log('  اختياري — بروكسي المحرك:');
    for (const item of SOFT_PATHS) {
      try {
        const { status } = await get(item.path);
        if (status === 200) {
          console.log('  OK', status, item.path, '← SearXNG يستجيب عبر البروكسي');
        } else {
          console.log('  SKIP', status, item.path, '—', item.note);
        }
      } catch (e) {
        console.log('  SKIP', item.path, '—', item.note);
      }
    }
    console.log('');
  }
  if (failed) {
    console.log('بعض الطلبات فشلت. تأكد: npm start يعمل من مجلد المشروع.');
    process.exit(1);
  }
  console.log('كل الروابط جاهزة — يمكنك فتح المتصفح.');
  process.exit(0);
}

main();
