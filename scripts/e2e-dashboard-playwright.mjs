/**
 * E2E: يفتح /admin-direct (تطوير) ثم يتوقع ظهور #dashboard-overlay.is-open
 * يشغّل الخادم تلقائياً إن لم يكن المنفذ مستمعاً (مثل smoke:with-server).
 *
 * تثبيت لمرة واحدة من جذر المشروع:
 *   npm install
 *   npx playwright install chromium
 *
 * التشغيل: npm run e2e:dashboard
 * تخطي:   SKIP_E2E=1 npm run e2e:dashboard
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
    console.log('SKIP_E2E=1 — تخطي اختبار Playwright');
    process.exit(0);
  }

  let chromium;
  try {
    const pw = await import('playwright');
    chromium = pw.chromium;
  } catch (e) {
    console.error('Playwright غير مثبت. نفّذ من جذر المشروع:');
    console.error('  npm install');
    console.error('  npx playwright install chromium');
    console.error('ثم: npm run e2e:dashboard');
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

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(45000);
    page.on('dialog', (d) => {
      try {
        d.dismiss();
      } catch (_) {}
    });

    console.log('E2E: فتح', `${BASE}/admin-direct`);
    await page.goto(`${BASE}/admin-direct`, { waitUntil: 'domcontentloaded' });

    await page.waitForURL(
      (u) => /iif-fund-demo\/index\.html/i.test(u.pathname) || u.search.includes('open_dashboard'),
      { timeout: 25000 }
    );

    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});

    console.log('E2E: انتظار فتح اللوحة (class is-open على #dashboard-overlay) …');
    const overlayOpen = () =>
      page.waitForFunction(
        () => {
          var el = document.getElementById('dashboard-overlay');
          return !!(el && el.classList.contains('is-open'));
        },
        { timeout: 40000 }
      );
    try {
      await overlayOpen();
    } catch (e1) {
      const quick = page.locator('#iif-admin-quick-open');
      if (await quick.count()) {
        console.log('E2E: محاولة النقر على «فتح لوحة التحكم الآن» …');
        await quick.click({ timeout: 5000 });
        await overlayOpen();
      } else {
        const dbg = await page.evaluate(() => {
          var email = '';
          try {
            email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          } catch (e) {}
          var can = null;
          var adm = null;
          try {
            if (typeof canAccessDashboard === 'function') can = canAccessDashboard();
          } catch (e2) {
            can = 'err:' + (e2 && e2.message);
          }
          try {
            if (typeof isAdmin === 'function') adm = isAdmin();
          } catch (e3) {
            adm = 'err:' + (e3 && e3.message);
          }
          return {
            hasOverlay: !!document.getElementById('dashboard-overlay'),
            overlayClass: document.getElementById('dashboard-overlay')
              ? document.getElementById('dashboard-overlay').getAttribute('class')
              : null,
            loggedIn: localStorage.getItem('iif-logged-in'),
            email: email,
            iifIsAdmin: localStorage.getItem('iif-is-admin'),
            canAccessDashboard: can,
            isAdmin: adm,
            href: location.href,
          };
        });
        console.error('E2E debug:', JSON.stringify(dbg, null, 2));
        const tryOpen = await page.evaluate(() => {
          try {
            var fn = window.IIF_openDashboard || window.openDashboard || window.openDashboardEnhanced;
            if (typeof fn === 'function') {
              fn();
              return { called: true, cls: document.getElementById('dashboard-overlay') && document.getElementById('dashboard-overlay').getAttribute('class') };
            }
            return { called: false };
          } catch (err) {
            return { err: String(err && err.message) };
          }
        });
        console.error('E2E try open dashboard:', JSON.stringify(tryOpen, null, 2));
        const hasOpen = await page.evaluate(() => {
          var el = document.getElementById('dashboard-overlay');
          return !!(el && el.classList.contains('is-open'));
        });
        if (hasOpen) {
          console.log('OK  لوحة التحكم ظهرت بعد استدعاء مباشر');
          await browser.close();
          shutdown(0);
          return;
        }
        throw e1;
      }
    }

    console.log('OK  لوحة التحكم ظاهرة (E2E Playwright)');
    await browser.close();
    shutdown(0);
  } catch (err) {
    console.error('FAIL E2E:', err.message || err);
    try {
      await browser?.close();
    } catch (_) {}
    shutdown(1);
  }
}

process.on('SIGINT', () => shutdown(130));
process.on('SIGTERM', () => shutdown(143));

main();
