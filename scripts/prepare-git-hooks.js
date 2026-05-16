#!/usr/bin/env node
/**
 * يُشغَّل من npm prepare بعد التثبيت: يثبّت pre-commit محلياً فقط (لا CI / لا نسخ بلا .git).
 */
'use strict';

if (process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true') {
  process.exit(0);
}

var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var root = path.join(__dirname, '..');

if (!fs.existsSync(path.join(root, '.git'))) {
  process.exit(0);
}

try {
  cp.execSync('git rev-parse --show-toplevel', { cwd: root, stdio: 'pipe' });
} catch (e) {
  process.exit(0);
}

try {
  cp.execSync('node scripts/install-git-hooks.js', { cwd: root, stdio: 'inherit' });
} catch (e) {
  process.exit(0);
}
