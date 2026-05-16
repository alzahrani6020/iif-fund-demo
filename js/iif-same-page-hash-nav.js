/**
 * NAVIGATION STACK: runs after site-header-inner-newtab.js. Single handler for # links on the
 * main page; dashboard/auth overlays use their own handlers (clicks inside them are ignored here).
 *
 * One capture-phase handler for same-page #fragment links (main document only).
 * - Smooth scroll via IIF_scrollIntoViewClearHeader when defined.
 * - Respects prefers-reduced-motion (uses 'auto' instead of 'smooth').
 * - Syncs the address bar with replaceState + synthetic hashchange when possible
 *   so deep links and existing hashchange listeners stay consistent.
 * - New tab only when data-iif-hash-newtab or .iif-hash-newtab (not inside dashboard/auth).
 *
 * Skips #dashboard-overlay and #auth-overlay — they use their own handlers.
 * Disable globally: <html data-iif-disable-same-page-hash-nav="1">
 */
(function () {
  'use strict';
  if (typeof document === 'undefined' || !document.addEventListener) return;
  try {
    if (document.documentElement.getAttribute('data-iif-disable-same-page-hash-nav') === '1') return;
  } catch (e0) {}

  function scrollBehaviorPref() {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 'auto';
      }
    } catch (e) {}
    return 'smooth';
  }

  function syncHashInBar(id) {
    var newHash = '#' + id;
    var oldHref = '';
    try {
      oldHref = window.location.href;
    } catch (e1) {}
    try {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search + newHash
        );
      }
    } catch (e2) {}
    try {
      if (typeof HashChangeEvent === 'function' && oldHref !== window.location.href) {
        window.dispatchEvent(
          new HashChangeEvent('hashchange', {
            oldURL: oldHref,
            newURL: window.location.href
          })
        );
      }
    } catch (e3) {}
  }

  function attach() {
    if (!document.body || document.body.getAttribute('data-iif-same-page-hash-nav') === '1') return;
    document.body.setAttribute('data-iif-same-page-hash-nav', '1');

    document.addEventListener(
      'click',
      function (e) {
        var a = e.target && e.target.closest && e.target.closest('a[href^="#"]');
        if (!a) return;
        var href = (a.getAttribute('href') || '').trim();
        if (!href || href === '#' || href === '#!') return;
        if (a.classList.contains('skip-link') || a.classList.contains('iif-skip-link')) return;
        if (a.closest('#dashboard-overlay') || a.closest('#auth-overlay')) return;

        if (typeof e.button === 'number' && e.button !== 0) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

        var forceNewTab = a.hasAttribute('data-iif-hash-newtab') || a.classList.contains('iif-hash-newtab');
        if (forceNewTab) {
          e.preventDefault();
          try {
            window.open(new URL(href, window.location.href).href, '_blank', 'noopener,noreferrer');
          } catch (eOpen) {
            try {
              window.open(window.location.pathname + window.location.search + href, '_blank', 'noopener,noreferrer');
            } catch (e2) {}
          }
          return;
        }

        var id = href.slice(1).split('?')[0].split('/')[0];
        if (!id) return;
        var el = document.getElementById(id);
        if (!el) return;

        var dash = document.getElementById('dashboard-overlay');
        if (dash && el.closest && el.closest('#dashboard-overlay') && !dash.classList.contains('is-open')) {
          return;
        }

        e.preventDefault();
        var behavior = scrollBehaviorPref();
        if (typeof window.IIF_scrollIntoViewClearHeader === 'function') {
          window.IIF_scrollIntoViewClearHeader(el, { behavior: behavior });
        } else {
          try {
            el.scrollIntoView({ behavior: behavior, block: 'start' });
          } catch (err) {
            try {
              el.scrollIntoView(true);
            } catch (e2) {}
          }
        }
        syncHashInBar(id);
      },
      true
    );
  }

  if (document.body) attach();
  else document.addEventListener('DOMContentLoaded', attach);
})();
