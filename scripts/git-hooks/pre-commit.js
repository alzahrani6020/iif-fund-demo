#!/usr/bin/env node
/**
 * pre-commit موحّد:
 * 1) مصادر i18n/pack في الـ staging → npm run i18n:packs + git add للحزم
 * 2) تحقق validate-site.js (أخطاء index.html تمنع الـ commit)
 *
 * تعطيل: SKIP_GIT_HOOKS=1 (الكل)
 *        SKIP_I18N_PRE_COMMIT=1 | SKIP_VALIDATE_PRE_COMMIT=1
 */
'use strict';

var fs = require('fs');
var cp = require('child_process');
var path = require('path');

if (process.env.SKIP_GIT_HOOKS) {
  process.exit(0);
}

function repoRoot() {
  return cp.execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
}

function stagedFiles(root) {
  var out = cp.execSync('git diff --cached --name-only --', {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });
  if (!out.trim()) return [];
  return out.trim().split(/\r?\n/).filter(Boolean);
}

var NEED_PACKS = [
  /^financial-consulting\/iif-fund-demo\/pack-data.*\.cjs$/,
  /^financial-consulting\/iif-fund-demo\/emit-service-packs\.cjs$/,
  /^financial-consulting\/iif-fund-demo\/i18n\.js$/
];

function normalizePath(p) {
  return p.split(path.sep).join('/');
}

function needsRegenerate(files) {
  for (var i = 0; i < files.length; i++) {
    var f = normalizePath(files[i]);
    for (var j = 0; j < NEED_PACKS.length; j++) {
      if (NEED_PACKS[j].test(f)) return true;
    }
  }
  return false;
}

var root = repoRoot();

if (!process.env.SKIP_I18N_PRE_COMMIT) {
  if (needsRegenerate(stagedFiles(root))) {
    console.log('[pre-commit] مصادر i18n/pack في الـ staging — إعادة توليد i18n-service-packs…');
    try {
      cp.execSync('npm run i18n:packs', { cwd: root, stdio: 'inherit' });
    } catch (e) {
      process.exit(e.status || 1);
    }
    var packs = ['a', 'b', 'c', 'd', 'all'].map(function (x) {
      return 'financial-consulting/iif-fund-demo/i18n-service-packs-' + x + '.js';
    });
    try {
      cp.execSync('git add -- ' + packs.join(' '), { cwd: root, stdio: 'inherit' });
    } catch (e) {
      process.exit(e.status || 1);
    }
  }
}

if (!process.env.SKIP_VALIDATE_PRE_COMMIT) {
  var validateScript = path.join(
    root,
    'financial-consulting',
    'iif-fund-demo',
    'scripts',
    'validate-site.js'
  );
  if (fs.existsSync(validateScript)) {
    var r = cp.spawnSync(process.execPath, [validateScript], {
      cwd: root,
      stdio: 'inherit'
    });
    if (r.status !== 0) {
      process.exit(r.status || 1);
    }
  }
}

process.exit(0);
