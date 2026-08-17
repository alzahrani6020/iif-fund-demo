/**
 * IIF — ترجمة آلية للصفحة للغات التي لا تملك قاموساً كاملاً في i18n.js
 * (مثلاً لغة بلا مفاتيح كافية في i18n.js تبقى أجزاء من النص من القاموس الإنجليزي).
 * اللغات اليدوية الواسعة (بدون Google): en, ar, fr, de, it, es, tr, fa, he, ur, ko, id, ms, zh, pt, ru, ja, hi — باقي رموز القائمة تُكمَّل عبر Google عند الحاجة.
 * يعتمد على cookie googtrans و widget Google (يُحمّل من index.html).
 */
(function () {
  var cfg = typeof window !== 'undefined' && window.IIF_CONFIG ? window.IIF_CONFIG : {};
  if (cfg.machineTranslate === false) return;

  /** لغات لها حزم ترجمة يدوية واسعة في i18n.js — لا نستخدم Google لها */
  var NATIVE = { en: 1, ar: 1, fr: 1, de: 1, it: 1, es: 1, tr: 1, fa: 1, he: 1, ur: 1, ko: 1, id: 1, ms: 1, zh: 1, pt: 1, ru: 1, ja: 1, hi: 1 };

  /** رموز IIF → رموز Google Translate (الوجهة من الإنجليزية) */
  var GOOGLE = {
    pl: 'pl', nl: 'nl', vi: 'vi', th: 'th',
    bn: 'bn', el: 'el', sv: 'sv',
    no: 'no', da: 'da', fi: 'fi', uk: 'uk', ro: 'ro', hu: 'hu', cs: 'cs', sk: 'sk',
    bg: 'bg', hr: 'hr', sr: 'sr', sl: 'sl', am: 'am', sw: 'sw', ne: 'ne',
    si: 'si', my: 'my', km: 'km', lo: 'lo', ta: 'ta', te: 'te', mr: 'mr', gu: 'gu',
    kn: 'kn', ml: 'ml', pa: 'pa', sq: 'sq', mk: 'mk', hy: 'hy', ka: 'ka', az: 'az',
    kk: 'kk', uz: 'uz', mn: 'mn', ca: 'ca', eu: 'eu', gl: 'gl'
  };

  function readGoogTrans() {
    try {
      var m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
      return m ? decodeURIComponent(m[1].trim()) : '';
    } catch (e) {
      return '';
    }
  }

  function writeGoogTrans(value) {
    var path = ';path=/;SameSite=Lax';
    var maxAgeClear = 'max-age=0;';
    if (!value) {
      document.cookie = 'googtrans=;' + maxAgeClear + path;
      return;
    }
    document.cookie = 'googtrans=' + value + path;
  }

  function desiredPath(lang) {
    if (!lang || NATIVE[lang]) return '';
    var g = GOOGLE[lang];
    return g ? '/en/' + g : '';
  }

  function normalizeCookie(raw) {
    if (!raw) return '';
    var s = String(raw).replace(/^\/+/, '/');
    if (s.indexOf('|') >= 0) s = s.replace(/\|/g, '/');
    return s;
  }

  function syncFromLang(lang) {
    if (typeof location !== 'undefined' && location.protocol === 'file:') return;
    var want = desiredPath(lang);
    var cur = normalizeCookie(readGoogTrans());
    if (want === cur) return;
    writeGoogTrans(want || null);
    try {
      location.reload();
    } catch (e) { }
  }

  window.addEventListener('iif-lang-change', function (ev) {
    try {
      var lang = ev && ev.detail && ev.detail.lang;
      lang = (typeof lang === 'string' ? lang : '').trim().toLowerCase();
      if (!lang) return;
      syncFromLang(lang);
    } catch (e2) { }
  });
})();
