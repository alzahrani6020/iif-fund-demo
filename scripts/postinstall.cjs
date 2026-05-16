/**
 * postinstall: خطوط (@fontsource) ثم Chromium لـ Playwright.
 * تخطّي المتصفح إذا:
 *   SKIP_PLAYWRIGHT_INSTALL=1 أو PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
 *   أو غياب node_modules/@playwright/test (مثلاً npm install --omit=dev).
 */
'use strict';

var fs = require('fs');
var path = require('path');
var spawnSync = require('child_process').spawnSync;

var root = path.join(__dirname, '..');
var node = process.execPath;

function run(title, cmd, args, opts) {
  opts = opts || {};
  var r = spawnSync(cmd, args, {
    stdio: 'inherit',
    cwd: root,
    shell: opts.shell === true,
    env: process.env,
  });
  if (r.status !== 0 && r.status != null) {
    console.error('[postinstall] failed:', title, 'exit', r.status);
    process.exit(r.status);
  }
  if (r.error) {
    console.error('[postinstall]', title, r.error);
    process.exit(1);
  }
}

function shouldSkipPlaywright() {
  if (process.env.SKIP_PLAYWRIGHT_INSTALL === '1') {
    console.log('[postinstall] skip Playwright: SKIP_PLAYWRIGHT_INSTALL=1');
    return true;
  }
  if (process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD === '1') {
    console.log('[postinstall] skip Playwright: PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1');
    return true;
  }
  var pw = path.join(root, 'node_modules', '@playwright', 'test');
  if (!fs.existsSync(pw)) {
    console.log('[postinstall] skip Playwright: @playwright/test not present (production or --omit=dev)');
    return true;
  }
  return false;
}

run('fonts:vendor', node, [path.join(root, 'scripts', 'vendor-fontsource-woff2.js')]);

if (!shouldSkipPlaywright()) {
  run(
    'playwright chromium',
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['playwright', 'install', 'chromium'],
    { shell: true }
  );
  console.log('[postinstall] Playwright Chromium ready');
}
