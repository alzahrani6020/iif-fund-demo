/**
 * إعداد IIF — تكامل محرك الويب (SearXNG)
 *
 * يُحمَّل من `SIMPLE-GOVERNMENT-PLATFORM.html` قبل السكربت الرئيسي.
 *
 * **الفكرة:** الفهرس المحلي (government-data.js) + المحرك = استعلام «كامل»:
 * مرجع ثابت + مصادر ويب عبر SearXNG (لا يُخزَّن الإنترنت كاملاً في JSON).
 *
 * - **localhost / 127.0.0.1:** `searxngEnabled` يكون `true` افتراضياً (مع `npm start` + Docker).
 * - **أي نطاق آخر (مثل Netlify):** `false` افتراضياً — بحث الويب عبر المحرك يحتاج بروكسي/خادماً لاحقاً.
 *
 * تجاوز يدوي (قبل تحميل هذه الوحدة أو مباشرة بعدها):
 *   window.__IIF_CONFIG__ = { searxngEnabled: true, searxngBase: 'https://مثال/مسار-بروكسي' };
 */
(function () {
  'use strict';
  window.__IIF_CONFIG__ = window.__IIF_CONFIG__ || {};
  if (typeof window.__IIF_CONFIG__.searxngEnabled === 'undefined') {
    var h = typeof location !== 'undefined' ? String(location.hostname || '') : '';
    window.__IIF_CONFIG__.searxngEnabled = h === 'localhost' || h === '127.0.0.1';
  }
})();
