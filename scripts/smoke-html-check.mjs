/**
 * فحص سريع: يجلب HTML رئيسية ويتأكد من وجود base وشعار وعدم نقص government-data
 * + مسارات حرجة لواجهة الصندوق: لوحة التحكم (Hash)
 * الاستخدام: node scripts/smoke-html-check.mjs (بعد npm start على 3333)
 */
import http from 'http';

const HOST = process.env.CHECK_HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 3333;

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: HOST, port: PORT, path, method: 'GET', timeout: 15000 },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
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
  const checks = [
    {
      path: '/financial-consulting/iif-fund-demo/index.html',
      mustInclude: [
        '<base id="iif-document-base"',
        'css/design-system.css',
        'css/public-shell.css',
        'css/public-components.css',
        'Noto Sans Arabic',
        'assets/emblem.jpg',
        'id="dashboard-overlay"',
        'iif-dashboard-fullpage-critical-head',
        // Build marker (versioned). Accept any dashboard-fullpage marker.
        'meta name="iif-build" content="dashboard-fullpage-',
        // Dashboard root marker (stable)
        'data-iif-dashboard-root="true"',
        // Close / back-to-site control (stable)
        'id="dashboard-close"',
        // Deployment verification marker (stable comment)
        'تحقق-النشر-iif-dashboard-fullpage',
      ],
      label: 'واجهة الصندوق (index)',
    },
    {
      path: '/financial-consulting/government-search/SIMPLE-GOVERNMENT-PLATFORM.html',
      mustInclude: [
        'government-data.js',
        'id="searchInput"',
        'id="gov-countries"',
        'id="gov-geographic"',
      ],
      label: 'المنصة الحكومية',
    },
    {
      path: '/financial-consulting/fund-site/index.html',
      mustInclude: [
        '../government-search/SIMPLE-GOVERNMENT-PLATFORM.html',
        '../iif-fund-demo/index.html',
        'executive-brief.html',
        'sovereign-standards.html',
        '<iframe',
      ],
      label: 'بوابة fund-site (iframe)',
    },
    {
      path: '/executive-brief.html',
      mustInclude: ['موجز للمستويات الرفيعة', 'Executive Brief', 'main id="main"'],
      label: 'موجز للمستويات الرفيعة',
    },
    {
      path: '/sovereign-standards.html',
      mustInclude: ['معايير المستوى السيادي', 'Sovereign-tier standards', 'main id="main"'],
      label: 'معايير المستوى السيادي',
    },
    {
      path: '/panel',
      mustInclude: ['open_dashboard=1', 'iif_admin_portal=1', 'iif-fund-demo/index.html'],
      label: 'اختصار /panel → واجهة الصندوق + فتح اللوحة',
    },
    {
      path: '/financial-consulting/iif-fund-demo/privacy.html',
      mustInclude: [
        'Privacy policy',
        'localStorage',
        'index.html#contact',
        'css/public-shell.css',
        'css/public-components.css',
        'Noto Sans Arabic',
      ],
      label: 'صفحة الخصوصية',
    },
    {
      path: '/financial-consulting/iif-fund-demo/about-institution.html',
      mustInclude: [
        'About the institution',
        'Leadership',
        'index.html#terms',
        'css/public-shell.css',
        'css/public-components.css',
        'iif-public-card',
        'Noto Sans Arabic',
      ],
      label: 'صفحة عن الصندوق',
    },
  ];

  let allOk = true;
  for (const c of checks) {
    let checkOk = true;
    try {
      const { status, body } = await get(c.path);
      if (status !== 200) {
        console.log('FAIL', c.label, c.path, 'HTTP', status);
        allOk = false;
        continue;
      }
      for (const needle of c.mustInclude) {
        if (!body.includes(needle)) {
          console.log('FAIL', c.label, 'ناقص:', needle);
          checkOk = false;
        }
      }
      if (checkOk) {
        console.log('OK ', c.label, c.path);
      } else {
        allOk = false;
      }
    } catch (e) {
      console.log('FAIL', c.path, e.message);
      allOk = false;
    }
  }
  process.exit(allOk ? 0 : 1);
}

main();
