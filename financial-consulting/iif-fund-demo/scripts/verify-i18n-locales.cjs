'use strict';
/**
 * Compares i18n.js `codes` and `L` keys; optionally checks index.html for stray <option> langs.
 * Run: node scripts/verify-i18n-locales.cjs
 * Exit 1 on mismatch.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const i18nPath = path.join(root, 'i18n.js');
const indexPath = path.join(root, 'index.html');

const i18n = fs.readFileSync(i18nPath, 'utf8');

const codesMatch = i18n.match(/var codes = \[([^\]]+)\]/);
if (!codesMatch) {
  console.error('Could not parse var codes');
  process.exit(1);
}
const codes = codesMatch[1]
  .split(',')
  .map(function (s) {
    return s.replace(/['"\s]/g, '');
  })
  .filter(Boolean);

const lKeys = [];
const lRe = /^\s{4}([a-z]{2}):\s*\{\s*name:/gm;
let lm;
while ((lm = lRe.exec(i18n)) !== null) {
  lKeys.push(lm[1]);
}

function sortedUnique(a) {
  var o = {};
  for (var i = 0; i < a.length; i++) o[a[i]] = true;
  return Object.keys(o).sort();
}

var cSet = sortedUnique(codes);
var lSet = sortedUnique(lKeys);

function diff(a, b) {
  var bi = {};
  for (var i = 0; i < b.length; i++) bi[b[i]] = true;
  var out = [];
  for (var j = 0; j < a.length; j++) {
    if (!bi[a[j]]) out.push(a[j]);
  }
  return out;
}

var inCodesNotL = diff(cSet, lSet);
var inLNotCodes = diff(lSet, cSet);

if (inCodesNotL.length || inLNotCodes.length) {
  console.error('codes vs L mismatch:');
  if (inCodesNotL.length) console.error('  in codes but not L:', inCodesNotL.join(', '));
  if (inLNotCodes.length) console.error('  in L but not codes:', inLNotCodes.join(', '));
  process.exit(1);
}

console.log('OK: codes and L both have', cSet.length, 'languages');

if (fs.existsSync(indexPath)) {
  var html = fs.readFileSync(indexPath, 'utf8');
  var mPicker = html.match(/id="iif-lang-picker"[^>]*>[\s\S]*?<\/select>/);
  if (mPicker && /<option\b/i.test(mPicker[0])) {
    console.warn('Note: #iif-lang-picker still contains static <option> elements');
  }
}
