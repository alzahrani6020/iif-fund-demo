/**
 * NAVIGATION STACK (load order): 1) this file — cross-document links in public header only;
 * 2) iif-same-page-hash-nav.js — same-page #fragments. Do not add another document-level click
 * handler for the same links without updating this comment.
 *
 * Public site header only (excludes .dashboard-header-bar).
 *
 * Important: A static HTML file is always loaded in full; index.html#section still downloads
 * the whole document — the browser cannot show "only one section" in a new tab. For in-page
 * sections, same-tab smooth scroll is the appropriate UX. This script opens a new tab only when
 * navigating to a different document (another path, external origin, etc.).
 *
 * Opt-out per link: data-iif-same-tab
 * Force hash link in new tab (rare): data-iif-hash-newtab or class iif-hash-newtab
 * Global disable: <html data-iif-disable-header-newtab="1">
 *
 * Load before inline smooth-scroll nav handlers on document.
 */
(function () {
  'use strict';
  if (typeof document === 'undefined' || !document.addEventListener) return;
  try {
    if (document.documentElement.getAttribute('data-iif-disable-header-newtab') === '1') return;
  } catch (e0) {}

  function stripIndexFile(pathname) {
    var p = pathname || '';
    var low = p.toLowerCase();
    if (low.endsWith('/index.html')) return p.slice(0, -10) || '/';
    if (low.endsWith('/index.htm')) return p.slice(0, -9) || '/';
    return p;
  }

  function trimTrailingSlash(p) {
    if (p.length > 1 && p.charAt(p.length - 1) === '/') return p.slice(0, -1);
    return p;
  }

  /** Same origin + same logical page (path/search); hash may differ. */
  function isSameDocument(abs, cur) {
    if (!abs || !cur || abs.origin !== cur.origin) return false;
    var pa = trimTrailingSlash(stripIndexFile(abs.pathname));
    var pb = trimTrailingSlash(stripIndexFile(cur.pathname));
    return pa === pb && abs.search === cur.search;
  }

  function onClick(e) {
    var shell = document.querySelector('header.site-header:not(.dashboard-header-bar) .site-header__inner');
    if (!shell || !e.target || !e.target.closest) return;
    if (!shell.contains(e.target)) return;
    var a = e.target.closest('a[href]');
    if (!a || !shell.contains(a)) return;
    if (a.hasAttribute('data-iif-same-tab')) return;
    if (a.classList.contains('skip-link') || a.classList.contains('iif-skip-link')) return;
    if (e.defaultPrevented) return;
    if (typeof e.button === 'number' && e.button !== 0) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    var raw = (a.getAttribute('href') || '').trim();
    if (!raw || raw === '#') return;
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
    } catch (e1) {
      cur = null;
    }

    if (cur && abs.href === cur.href) return;

    var forceHashNewTab =
      a.hasAttribute('data-iif-hash-newtab') || a.classList.contains('iif-hash-newtab');
    if (cur && isSameDocument(abs, cur) && !forceHashNewTab) {
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
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
  }

  function attach() {
    if (!document.body) return;
    if (document.body.getAttribute('data-iif-header-inner-newtab') === '1') return;
    document.body.setAttribute('data-iif-header-inner-newtab', '1');
    document.addEventListener('click', onClick, true);
  }

  if (document.body) attach();
  else document.addEventListener('DOMContentLoaded', attach);
})();
