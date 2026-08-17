#!/usr/bin/env node
/**
 * يوجّه إلى مثبّت الخطاف في جذر المستودع (Git هناك عادةً، وليس داخل هذا المجلد).
 * شغّل: node scripts/install-validate-hook.js
 */
'use strict';

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var siteDir = path.join(__dirname, '..');
var top;
try {
  top = cp.execSync('git rev-parse --show-toplevel', { cwd: siteDir, encoding: 'utf8' }).trim();
} catch (e) {
  console.log('لا يوجد مستودع git — تخطي تثبيت الخطاف.');
  process.exit(0);
}

var installer = path.join(top, 'scripts', 'install-git-hooks.js');
if (!fs.existsSync(installer)) {
  console.error('غير موجود:', installer);
  process.exit(1);
}

cp.execSync('node scripts/install-git-hooks.js', { cwd: top, stdio: 'inherit' });
