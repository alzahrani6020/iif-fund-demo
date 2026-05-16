/**
 * E2E خفيف: صفحة الصندوق العامة على عرض جوال + تحقق RTL/عربي (خط Noto).
 * يشغّل الخادم تلقائياً إن لم يكن المنفذ مستمعاً.
 *
 *   npx playwright install chromium   # مرة واحدة
 *   npm run e2e:public
 *   SKIP_E2E=1 npm run e2e:public      # تخطي
 */
import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.PORT) || 3333;
const HOST = process.env.CHECK_HOST || '127.0.0.1';
const BASE = `http://${HOST}:${PORT}`;
const FUND = `${BASE}/financial-consulting/iif-fund-demo/index.html`;

function isServerUp(timeoutMs = 800) {
  return new Promise((resolve) => {
    const req = http.request({ hostname: HOST, port: PORT, path: '/', method: 'GET', timeout: timeoutMs }, (res) => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

function waitForPort(ms = 25000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function tryOnce() {
      const req = http.request(
        { hostname: HOST, port: PORT, path: '/', method: 'GET', timeout: 2000 },
        (res) => {
          res.resume();
          resolve();
        }
      );
      req.on('error', () => {
        if (Date.now() - start > ms) reject(new Error(`Timeout: no server on ${HOST}:${PORT}`));
        else setTimeout(tryOnce, 250);
      });
      req.on('timeout', () => {
        req.destroy();
        if (Date.now() - start > ms) reject(new Error(`Timeout: no server on ${HOST}:${PORT}`));
        else setTimeout(tryOnce, 250);
      });
      req.end();
    }
    tryOnce();
  });
}

let child = null;
let exiting = false;

function shutdown(code) {
  if (exiting) return;
  exiting = true;
  try {
    child && child.kill('SIGTERM');
  } catch (_) {}
  setTimeout(() => {
    try {
      child && child.kill('SIGKILL');
    } catch (_) {}
    process.exit(code ?? 0);
  }, 900);
}

async function main() {
  if (process.env.SKIP_E2E === '1') {
    console.log('SKIP_E2E=1 — تخطي e2e:public');
    process.exit(0);
  }

  let chromium;
  try {
    const pw = await import('playwright');
    chromium = pw.chromium;
  } catch (e) {
    console.error('Playwright غير جاهز. من جذر المشروع: npm install && npx playwright install chromium');
    process.exit(1);
  }

  const external = await isServerUp();
  if (!external) {
    child = spawn(process.execPath, [path.join(ROOT, 'scripts', 'dev-server.js')], {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, PORT: String(PORT) },
    });
    child.on('error', (err) => {
      console.error(err);
      shutdown(1);
    });
    await waitForPort();
  }

  const consoleErrors = [];
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(35000);
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message || String(err));
    });
    page.on('dialog', (d) => {
      try {
        d.dismiss();
      } catch (_) {}
    });

    await page.setViewportSize({ width: 390, height: 844 });
    console.log('E2E public: جوال 390×844 —', FUND);
    await page.goto(FUND, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main#main-content', { state: 'visible' });
    await page.waitForSelector('header.site-header', { state: 'visible' });

    const hero = await page.locator('section.hero').count();
    if (hero < 1) throw new Error('section.hero غير موجود');

    console.log('E2E public: /api/news (lang=ar, cat=asian)');
    const newsRes = await page.request.get(`${BASE}/api/news?lang=ar&cat=asian`);
    if (!newsRes.ok()) throw new Error('api/news فشل HTTP ' + newsRes.status());
    const newsJson = await newsRes.json();
    if (!newsJson || !Array.isArray(newsJson.items)) throw new Error('api/news بدون items[]');
    const nHeaders = newsRes.headers();
    const cnt = nHeaders['x-iif-news-item-count'] || nHeaders['X-IIF-News-Item-Count'];
    if (cnt != null && String(newsJson.items.length) !== String(cnt)) {
      throw new Error('X-IIF-News-Item-Count لا يطابق طول items');
    }
    const newsFr = await page.request.get(`${BASE}/api/news?lang=fr&cat=asian`);
    if (!newsFr.ok()) throw new Error('api/news lang=fr فشل');
    const jFr = await newsFr.json();
    if (!jFr || !Array.isArray(jFr.items)) throw new Error('api/news fr بدون items');

    await page.evaluate(() => {
      document.documentElement.setAttribute('data-lang', 'ar');
      document.documentElement.setAttribute('lang', 'ar');
      document.documentElement.setAttribute('dir', 'rtl');
    });
    await page.waitForFunction(
      () => /Noto Sans Arabic/i.test(getComputedStyle(document.body).fontFamily || ''),
      { timeout: 20000 }
    );

    console.log('E2E public: privacy.html');
    await page.goto(`${BASE}/financial-consulting/iif-fund-demo/privacy.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1', { state: 'visible' });

    const critical = consoleErrors.filter((t) =>
      /Uncaught|ReferenceError|TypeError:\s*.*is not a function/i.test(t)
    );
    if (critical.length) {
      console.error(critical.slice(0, 5));
      throw new Error(`أخطاء JS حرجة في console: ${critical[0]}`);
    }

    console.log('OK  e2e:public (جوال + RTL + privacy)');
    await browser.close();
    shutdown(0);
  } catch (err) {
    console.error('FAIL e2e:public:', err.message || err);
    try {
      await browser?.close();
    } catch (_) {}
    shutdown(1);
  }
}

process.on('SIGINT', () => shutdown(130));
process.on('SIGTERM', () => shutdown(143));

main();
