#!/usr/bin/env node
/**
 * تثبيت pre-commit: i18n packs + validate-site (من githooks/pre-commit).
 * يدوياً: npm run install:git-hooks — أو تلقائياً بعد npm install (prepare).
 */
'use strict';

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var top;
try {
  top = cp.execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
} catch (e) {
  console.error('ليس داخل مستودع git أو git غير متوفر.');
  process.exit(1);
}

var sourceHook = path.join(top, 'githooks', 'pre-commit');
var hookPath = path.join(top, '.git', 'hooks', 'pre-commit');
var hookDir = path.dirname(hookPath);

try {
  if (!fs.existsSync(hookDir)) fs.mkdirSync(hookDir, { recursive: true });
  if (!fs.existsSync(sourceHook)) {
    console.error('الملف غير موجود:', sourceHook);
    process.exit(1);
  }
  fs.copyFileSync(sourceHook, hookPath);
  try {
    fs.chmodSync(hookPath, 0o755);
  } catch (e) {}
  console.log('تم تثبيت pre-commit: (1) pack-data/emit/i18n.js → i18n:packs + git add (2) validate-site.js على كل commit.');
} catch (e) {
  console.error('تعذر التثبيت:', e.message);
  process.exit(1);
}
