/**
 * Static hosting notice (GitHub Pages, Netlify): local-only data + JSON export tip.
 * - index.html: include markup #iif-static-host-banner (optional)
 * - leaf pages: script creates the bar if missing
 * Sync stub: set window.iifIsStaticPublicHost in index <head> or body before auth if needed.
 */
(function () {
  'use strict';

  function isStaticHost() {
    try {
      var h = (location.hostname || '').toLowerCase();
      if (h.endsWith('.github.io')) return true;
      if (h.endsWith('.netlify.app')) return true;
      return false;
    } catch (e) {
      return false;
    }
  }

  if (typeof window.iifIsStaticPublicHost !== 'function') {
    window.iifIsStaticPublicHost = isStaticHost;
  }

  var DISMISS_KEY = 'iif-static-host-banner-dismissed';

  function ensureBannerStyles() {
    if (document.getElementById('iif-static-host-banner-styles')) return;
    var css =
      '.iif-static-host-banner{position:fixed;bottom:0;left:0;right:0;z-index:12000;padding:0.65rem 1rem;' +
      'background:linear-gradient(180deg,rgba(15,23,42,.97),rgba(10,14,24,.99));' +
      'border-top:1px solid rgba(201,162,39,.45);box-shadow:0 -4px 24px rgba(0,0,0,.35)}' +
      '.iif-static-host-banner[hidden]{display:none!important}' +
      '.iif-static-host-banner__inner{max-width:52rem;margin:0 auto;display:flex;flex-wrap:wrap;' +
      'align-items:flex-end;gap:0.75rem 1rem;justify-content:space-between}' +
      '.iif-static-host-banner__copy{flex:1 1 16rem;font-size:0.78rem;line-height:1.45;color:#cbd5e1}' +
      '.iif-static-host-banner__copy p{margin:0 0 0.35rem}' +
      '.iif-static-host-banner__btn{flex:0 0 auto;padding:0.35rem 0.9rem;border-radius:6px;' +
      'border:1px solid rgba(201,162,39,.55);background:rgba(201,162,39,.15);color:#f5e9b8;cursor:pointer;font-size:0.85rem}' +
      '.iif-static-host-banner__btn:focus-visible{outline:2px solid #e8d48a;outline-offset:3px}';
    var s = document.createElement('style');
    s.id = 'iif-static-host-banner-styles';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function buildBannerMarkup() {
    var wrap = document.createElement('div');
    wrap.id = 'iif-static-host-banner';
    wrap.className = 'iif-static-host-banner';
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Static hosting notice');
    wrap.setAttribute('aria-live', 'polite');
    wrap.innerHTML =
      '<div class="iif-static-host-banner__inner">' +
      '<div class="iif-static-host-banner__copy">' +
      '<p dir="ltr"><strong>Static hosting:</strong> sign-in and dashboard data stay in <strong>this browser only</strong>. Other devices do not share it. Admins: <strong>Dashboard → Export JSON / Import JSON</strong> to merge.</p>' +
      '<p dir="rtl"><strong>استضافة ثابتة:</strong> تسجيل الدخول وبيانات اللوحة في <strong>هذا المتصفح فقط</strong>. الأجهزة الأخرى لا تشاركها. للإدارة: <strong>لوحة التحكم ← تصدير JSON / استيراد JSON</strong>.</p>' +
      '</div>' +
      '<button type="button" class="iif-static-host-banner__btn" id="iif-static-host-banner-dismiss">OK</button>' +
      '</div>';
    return wrap;
  }

  function wireDismiss(btn, bar) {
    if (!btn || btn.dataset.iifStaticBannerWired === '1') return;
    btn.dataset.iifStaticBannerWired = '1';
    btn.addEventListener('click', function () {
      try {
        localStorage.setItem(DISMISS_KEY, '1');
      } catch (e) {}
      bar.hidden = true;
    });
  }

  function focusBannerDismiss() {
    try {
      var bar = document.getElementById('iif-static-host-banner');
      if (!bar || bar.hidden) return;
      var btn = document.getElementById('iif-static-host-banner-dismiss');
      if (!btn) return;
      setTimeout(function () {
        try {
          btn.focus({ preventScroll: true });
        } catch (e) {
          btn.focus();
        }
      }, 100);
    } catch (e2) {}
  }

  function initBanner() {
    if (!window.iifIsStaticPublicHost()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return;
    } catch (e0) {}

    var b = document.getElementById('iif-static-host-banner');
    if (!b) {
      b = buildBannerMarkup();
      document.body.appendChild(b);
    }
    b.hidden = false;
    wireDismiss(document.getElementById('iif-static-host-banner-dismiss'), b);
    focusBannerDismiss();
  }

  window.IIF_showStaticHostBannerAgain = function () {
    ensureBannerStyles();
    try {
      localStorage.removeItem(DISMISS_KEY);
    } catch (e) {}
    var b = document.getElementById('iif-static-host-banner');
    if (!b) {
      b = buildBannerMarkup();
      document.body.appendChild(b);
    }
    b.hidden = false;
    wireDismiss(document.getElementById('iif-static-host-banner-dismiss'), b);
    focusBannerDismiss();
    try {
      b.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } catch (e2) {}
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBanner);
  } else {
    initBanner();
  }
})();
