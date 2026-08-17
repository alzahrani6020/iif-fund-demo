#!/usr/bin/env node
/**
 * يقارن مفاتيح T.en (المرجع) بكل حزمة لغة: ما هو مفقود في الكائن مباشرة.
 * للغات de/es/it/zh يطبّق منطقاً مشابهاً لـ text() لمنطقة لوحة التحكم:
 * مفاتيح dash* / dashCert* / dashPa* / cert* / videoCall* تُحسب «مغطاة» إن وُجدت في T.fr.
 *
 * الاستخدام:
 *   node scripts/check-i18n-keys.js
 *   node scripts/check-i18n-keys.js --verbose
 *   node scripts/check-i18n-keys.js --lang=de
 *   node scripts/check-i18n-keys.js --json
 *   node scripts/check-i18n-keys.js --strict   # خروج 1 إن وُجدت ثغرات dash|cert|videoCall لـ de/es/it/zh
 */
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var IMPORTANT_15 = ['en', 'ar', 'zh', 'es', 'fr', 'de', 'pt', 'ru', 'ja', 'ko', 'it', 'tr', 'hi', 'fa', 'he'];
var DASH_ZONE_RE = /^(dash|dashCert|dashPa|cert|videoCall)/;

function loadI18n() {
  var i18nPath = path.join(__dirname, '..', 'i18n.js');
  var code = fs.readFileSync(i18nPath, 'utf8');
  var sandbox = {
    window: {
      addEventListener: function () {},
      dispatchEvent: function () {
        return true;
      },
      CustomEvent: function () {}
    },
    console: console
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  var api = sandbox.window.IIF_I18N;
  if (!api || !api.T || !api.codes) {
    throw new Error('تعذّر تحميل IIF_I18N من i18n.js');
  }
  return api;
}

function parseArgs() {
  var args = process.argv.slice(2);
  var out = { verbose: false, lang: null, json: false, help: false, strict: false };
  args.forEach(function (a) {
    if (a === '--verbose' || a === '-v') out.verbose = true;
    else if (a === '--json') out.json = true;
    else if (a === '--strict') out.strict = true;
    else if (a === '--help' || a === '-h') out.help = true;
    else if (a.indexOf('--lang=') === 0) out.lang = a.slice('--lang='.length).trim().toLowerCase();
  });
  return out;
}

function effectiveMissing(enKeys, pack, frPack, lang) {
  var frFallbackLangs = { de: 1, es: 1, it: 1, zh: 1 };
  var useFr = frFallbackLangs[lang];
  var missing = [];
  var missingDashZone = [];
  var coveredByFr = [];

  for (var i = 0; i < enKeys.length; i++) {
    var k = enKeys[i];
    if (pack[k] != null) continue;
    missing.push(k);
    if (useFr && DASH_ZONE_RE.test(k) && frPack && frPack[k] != null) {
      coveredByFr.push(k);
    } else if (useFr && DASH_ZONE_RE.test(k)) {
      missingDashZone.push(k);
    }
  }

  return {
    missing: missing,
    missingCount: missing.length,
    coveredByFr: coveredByFr,
    missingDashZone: missingDashZone
  };
}

function main() {
  var opts = parseArgs();
  if (opts.help) {
    console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(0, 12).join('\n'));
    process.exit(0);
  }

  var api = loadI18n();
  var T = api.T;
  var codes = api.codes;
  var enKeys = Object.keys(T.en);
  var frPack = T.fr;

  var langs = opts.lang ? [opts.lang] : IMPORTANT_15;
  langs = langs.filter(function (l) {
    return codes.indexOf(l) >= 0;
  });

  var rows = [];
  langs.forEach(function (lang) {
    var pack = T[lang];
    if (!pack) {
      rows.push({ lang: lang, error: 'no pack' });
      return;
    }
    var r = effectiveMissing(enKeys, pack, frPack, lang);
    rows.push({
      lang: lang,
      totalEnKeys: enKeys.length,
      missingFromPack: r.missingCount,
      dashZoneHoles: r.missingDashZone.length,
      coveredByFrDash: r.coveredByFr.length,
      missingDashZoneKeys: r.missingDashZone,
      missingSample: r.missing.slice(0, opts.verbose ? 200 : 8)
    });
  });

  if (opts.json) {
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  }

  console.log('[i18n] مرجع المفاتيح: T.en — عدد المفاتيح: ' + enKeys.length);
  console.log('[i18n] اللغات المعروضة: ' + langs.join(', '));
  console.log('');

  rows.forEach(function (row) {
    if (row.error) {
      console.log(row.lang + ': ' + row.error);
      return;
    }
    var line =
      row.lang +
      ': مفقود من الحزمة ' +
      row.missingFromPack +
      ' / ' +
      row.totalEnKeys +
      ' — ثغرات منطقة dash|cert|videoCall (بدون fr): ' +
      row.dashZoneHoles +
      ' — مغطى عبر fr: ' +
      row.coveredByFrDash;
    console.log(line);
    if (row.dashZoneHoles > 0 && opts.verbose) {
      console.log('  ثغرات المنطقة: ' + row.missingDashZoneKeys.join(', '));
    }
    if (opts.verbose && row.missingSample.length) {
      console.log('  عيّنة مفاتيح مفقودة: ' + row.missingSample.join(', '));
    }
  });

  var anyHole = rows.some(function (r) {
    return r.dashZoneHoles > 0;
  });
  if (anyHole && !opts.strict) {
    console.log('');
    console.log('(ثغرات المنطقة ما زالت موجودة؛ استخدم --strict لخروج 1 في CI، أو راجع i18n.js / أضف مفاتيح في T.fr.)');
  }
  process.exit(opts.strict && anyHole ? 1 : 0);
}

main();
