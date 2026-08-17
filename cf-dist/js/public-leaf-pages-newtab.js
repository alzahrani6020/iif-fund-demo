/**
 * On static leaf pages (about-institution, privacy), open navigational links in a
 * new tab so the current article stays open. Opt out: data-iif-same-tab on the anchor.
 * Same-document links (same path + query, hash-only change) stay in-tab.
 */
(function () {
  'use strict';

  var path = '';
  try {
    path = window.location.pathname || '';
  } catch (e) {}

  var hrefNoQ = (window.location.href || '').split('?')[0].split('#')[0];
  var isLeaf =
    /\/(?:about-institution|privacy)\.html$/i.test(path) ||
    /[\\/]about-institution\.html$/i.test(hrefNoQ) ||
    /[\\/]privacy\.html$/i.test(hrefNoQ);

  if (!isLeaf) {
    try {
      if (document.documentElement.getAttribute('data-iif-leaf-newtab') === '1') {
        isLeaf = true;
      }
    } catch (e2) {}
  }
  if (!isLeaf) return;

  document.addEventListener(
    'click',
    function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      if (a.hasAttribute('data-iif-same-tab')) return;
      if (e.defaultPrevented) return;
      if (typeof e.button === 'number' && e.button !== 0) return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      var raw = (a.getAttribute('href') || '').trim();
      if (!raw || raw === '#' || raw.charAt(0) === '#') return;
      if (/^javascript:/i.test(raw)) return;
      if (/^mailto:/i.test(raw)) return;
      if (/^tel:/i.test(raw)) return;

      var abs;
      try {
        abs = new URL(a.getAttribute('href'), window.location.href);
      } catch (err) {
        return;
      }

      var cur;
      try {
        cur = new URL(window.location.href);
      } catch (e3) {
        cur = null;
      }

      if (cur && abs.href === cur.href) return;

      if (
        cur &&
        abs.origin === cur.origin &&
        abs.pathname === cur.pathname &&
        abs.search === cur.search
      ) {
        return;
      }

      e.preventDefault();
      try {
        var w = window.open(abs.href, '_blank', 'noopener,noreferrer');
        if (!w || w.closed) {
          window.location.href = abs.href;
        }
      } catch (eOpen) {
        try {
          window.location.href = abs.href;
        } catch (eNav) {}
      }
    },
    true
  );
})();
