/**
 * يتحقق من وجود معرفات أقسام شائعة للمراسي (#section-id) داخل index.html.
 * تشغيل: node scripts/check-anchor-targets.cjs
 */
'use strict';

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var htmlPath = path.join(root, 'index.html');
var html = fs.readFileSync(htmlPath, 'utf8');

var ids = new Set();
var reId = /\bid\s*=\s*["']([^"']+)["']/gi;
var m;
while ((m = reId.exec(html)) !== null) {
  ids.add(m[1]);
}

var required = [
  'main-content',
  'trust-entry',
  'financing-request',
  'financial-consultation',
  'government-bot',
  'stakeholders',
  'selection-criteria',
  'governance-snapshot',
  'partners-trust',
  'contact',
  'terms',
  'compliance',
  'iif-trust-paths-label'
];

var missing = required.filter(function (id) {
  return !ids.has(id);
});

if (missing.length) {
  console.error('check-anchor-targets: missing id(s) in index.html:', missing.join(', '));
  process.exit(1);
}

console.log('check-anchor-targets: OK (' + required.length + ' anchors)');
process.exit(0);
