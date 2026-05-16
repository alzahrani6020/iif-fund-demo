/**
 * Subtle top progress strip during first paint until window load.
 * Skips embed/admin portal modes and prefers-reduced-motion (instant hide).
 */
(function () {
  'use strict';
  var el = document.getElementById('iif-first-load-shell');
  if (!el) return;

  function skipEmbed() {
    try {
      var q = new URLSearchParams(window.location.search || '');
      if (q.get('iif_admin_embed') === '1' || q.get('iif_admin_portal') === '1') return true;
    } catch (e) {
      return false;
    }
    try {
      if (document.documentElement.classList.contains('iif-admin-embed')) return true;
    } catch (e2) {}
    return false;
  }

  function reducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  var hidden = false;
  function hide() {
    if (hidden) return;
    hidden = true;
    el.setAttribute('aria-busy', 'false');
    el.classList.add('iif-first-load-shell--hide');
    try {
      el.setAttribute('aria-hidden', 'true');
    } catch (e) {}
    window.setTimeout(function () {
      try {
        el.style.display = 'none';
      } catch (e2) {}
    }, 400);
  }

  if (skipEmbed() || reducedMotion()) {
    hide();
    return;
  }

  var maxT = window.setTimeout(hide, 9000);
  function done() {
    window.clearTimeout(maxT);
    hide();
  }

  if (document.readyState === 'complete') {
    done();
  } else {
    window.addEventListener('load', done, { once: true });
    document.addEventListener(
      'DOMContentLoaded',
      function () {
        window.setTimeout(function () {
          if (document.readyState === 'complete') done();
        }, 400);
      },
      { once: true }
    );
  }
})();
