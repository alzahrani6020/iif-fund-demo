#!/usr/bin/env node
/**
 * تحقق مؤتمت من الموقع — يعمل مع أي منصة (محلي، CI، أونلاين).
 * يشغّل قبل النشر أو عند إضافة ميزة جديدة لضمان قوة الأداء والدقة.
 * الاستخدام: node scripts/validate-site.js
 */
var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var indexPath = path.join(root, 'index.html');
var appBundlePath = path.join(root, 'js', 'iif-index-app-bundle.js');
var errors = [];
var warnings = [];

function readIndex() {
  try {
    return fs.readFileSync(indexPath, 'utf8');
  } catch (e) {
    errors.push('لا يمكن قراءة index.html: ' + e.message);
    return '';
  }
}

/** نص للبحث عن رموز JS بعد نقل المنطق من inline إلى ملفات الحزمة */
function readAppBundleSlice() {
  try {
    if (fs.existsSync(appBundlePath)) {
      return fs.readFileSync(appBundlePath, 'utf8');
    }
  } catch (e) {
    warnings.push('تعذّر قراءة js/iif-index-app-bundle.js: ' + e.message);
  }
  return '';
}

function checkHttpsMeta(html) {
  var m = html.match(/<meta\s+name=["']iif-funcs-base["']\s+content=["']([^"']+)["']/i);
  if (m && m[1]) {
    if (m[1].trim().indexOf('http://') === 0) {
      errors.push('meta iif-funcs-base يجب أن يستخدم HTTPS وليس HTTP: ' + m[1]);
    }
  }
}

function checkFormActions(html) {
  var formRegex = /<form[^>]*action=["']([^"']*)["'][^>]*>/gi;
  var match;
  while ((match = formRegex.exec(html)) !== null) {
    var action = (match[1] || '').trim();
    if (action && action.indexOf('http://') === 0) {
      errors.push('form action لا يجب أن يشير إلى HTTP: ' + action);
    }
  }
}

function checkProactiveRefresh(html) {
  if (html.indexOf('proactiveRefreshUI') === -1) {
    warnings.push('لم يُعثر على proactiveRefreshUI — تأكد من إعادة رسم الأقسام بعد التخزين المشفّر.');
  }
  if (html.indexOf('IIF_proactiveRefreshUI') === -1) {
    warnings.push('لم يُعثر على IIF_proactiveRefreshUI — قد تحتاج لربط إعادة الرسم.');
  }
}

function checkHttpsWarning(html) {
  if (html.indexOf('https-warning') === -1) {
    warnings.push('لم يُعثر على عنصر تحذير HTTPS (id="https-warning").');
  }
}

function checkEnsureHttpsUrl(html) {
  if (html.indexOf('ensureHttpsUrl') === -1) {
    warnings.push('لم يُعثر على ensureHttpsUrl — تحويل روابط API إلى HTTPS.');
  }
}

var html = readIndex();
var bundleJs = readAppBundleSlice();
var htmlPlusApp = html + '\n' + bundleJs;
if (html) {
  checkHttpsMeta(html);
  checkFormActions(html);
  checkProactiveRefresh(htmlPlusApp);
  checkHttpsWarning(html);
  checkEnsureHttpsUrl(htmlPlusApp);
}

if (errors.length) {
  console.error('[تحقق الموقع] أخطاء:');
  errors.forEach(function(e) { console.error('  - ' + e); });
}
if (warnings.length) {
  console.warn('[تحقق الموقع] تحذيرات:');
  warnings.forEach(function(w) { console.warn('  - ' + w); });
}

var code = errors.length ? 1 : 0;
if (code === 0 && (errors.length || warnings.length)) {
  console.log('[تحقق الموقع] انتهى. أخطاء: ' + errors.length + '، تحذيرات: ' + warnings.length);
} else if (code === 0) {
  console.log('[تحقق الموقع] تم — لا أخطاء.');
}
process.exit(code);
