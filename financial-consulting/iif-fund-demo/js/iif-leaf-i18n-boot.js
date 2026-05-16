/**
 * Static leaf pages: apply saved or ?lang= UI language to [data-i18n] without
 * rewriting document title / SEO (html[data-iif-leaf-static="1"] skips that in i18n.js).
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    try {
      var I = window.IIF_I18N;
      if (!I || typeof I.apply !== 'function' || typeof I.detect !== 'function') return;
      var raw = new URLSearchParams(location.search || '').get('lang');
      var ql = raw && String(raw).trim().toLowerCase();
      var code = ql && I.codes && I.codes.indexOf(ql) >= 0 ? ql : I.detect();
      I.apply(code);
    } catch (e) {}
  });
})();
