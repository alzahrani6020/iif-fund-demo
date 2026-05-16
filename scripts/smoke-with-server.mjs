/**
 * يشغّل خادم التطوير على PORT ثم npm run smoke:html ثم يوقف الخادم.
 * يعمل على Windows و Linux/macOS — للتحقق المحلي دون خطوات يدوية.
 */
import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.PORT) || 3333;
const HOST = process.env.CHECK_HOST || '127.0.0.1';

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

function waitForPort(ms = 20000) {
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
        if (Date.now() - start > ms) {
          reject(new Error(`Timeout: server did not listen on ${HOST}:${PORT}`));
        } else {
          setTimeout(tryOnce, 200);
        }
      });
      req.on('timeout', () => {
        req.destroy();
        if (Date.now() - start > ms) {
          reject(new Error(`Timeout: server did not listen on ${HOST}:${PORT}`));
        } else {
          setTimeout(tryOnce, 200);
        }
      });
      req.end();
    }
    tryOnce();
  });
}

let child = null;
const usingExternalServer = await isServerUp();
if (!usingExternalServer) {
  child = spawn(process.execPath, [path.join(ROOT, 'scripts', 'dev-server.js')], {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(PORT) },
    detached: false,
  });
}

let exiting = false;
let serverReady = false;

if (child) {
  child.on('exit', (code) => {
    if (exiting) return;
    if (!serverReady) {
      console.error(
        `dev-server exited before smoke (code ${code}). إن كان المنفذ ${PORT} مستخدماً: أوقف الخادم الآخر أو استخدم PORT=3334 npm run smoke:with-server`
      );
      process.exit(code ?? 1);
    }
  });
}
function shutdown(code) {
  if (exiting) return;
  exiting = true;
  try {
    child && child.kill('SIGTERM');
  } catch (_) { }
  setTimeout(() => {
    try {
      child && child.kill('SIGKILL');
    } catch (_) { }
    process.exit(code ?? 0);
  }, 800);
}

process.on('SIGINT', () => shutdown(130));
process.on('SIGTERM', () => shutdown(143));

if (child) {
  child.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });
}

try {
  if (!usingExternalServer) {
    await waitForPort();
  }
  serverReady = true;
} catch (e) {
  console.error(e.message || e);
  shutdown(1);
}

const smoke = spawn(process.execPath, [path.join(ROOT, 'scripts', 'smoke-html-check.mjs')], {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, PORT: String(PORT), CHECK_HOST: HOST },
});

smoke.on('close', (code) => {
  if (code !== 0) {
    shutdown(code ?? 1);
    return;
  }
  const checkUrls = spawn(process.execPath, [path.join(ROOT, 'scripts', 'check-urls.js')], {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(PORT), CHECK_HOST: HOST },
  });
  checkUrls.on('close', (c2) => {
    if (c2 !== 0) {
      shutdown(c2 ?? 1);
      return;
    }
    const newsSmoke = spawn(process.execPath, [path.join(ROOT, 'scripts', 'smoke-news-api.mjs')], {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, PORT: String(PORT), CHECK_HOST: HOST },
    });
    newsSmoke.on('close', (c3) => shutdown(c3 ?? 0));
    newsSmoke.on('error', (err) => {
      console.error(err);
      shutdown(1);
    });
  });
  checkUrls.on('error', (err) => {
    console.error(err);
    shutdown(1);
  });
});
