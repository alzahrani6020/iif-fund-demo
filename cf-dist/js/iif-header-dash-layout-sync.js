/**
 * Syncs CSS variables for sticky header height and dashboard overlay scroll insets.
 */
(function () {
  function syncHeaderHeight() {
    try {
      var hdr = document.querySelector('header.site-header');
      if (!hdr) return;
      var st = window.getComputedStyle(hdr);
      if (st.display === 'none' || st.visibility === 'hidden') return;
      var h = Math.ceil(hdr.getBoundingClientRect().height);
      if (h < 48) return;
      document.documentElement.style.setProperty('--header-height', h + 12 + 'px');
    } catch (eSync) { }
  }
  function syncDashboardScrollOffsetsImpl() {
    try {
      var dash = document.getElementById('dashboard-overlay');
      var bar = dash && dash.querySelector('.dashboard-header-bar');
      if (!dash || !bar || !dash.classList.contains('is-open')) return;
      var dst = window.getComputedStyle(dash);
      if (dst.display === 'none' || dst.visibility === 'hidden') return;
      var br = bar.getBoundingClientRect();
      var h = Math.ceil(br.height);
      if (h >= 40) dash.style.setProperty('--dash-header-height', h + 'px');
      var cr = dash.getBoundingClientRect();
      var toc = dash.querySelector('#dashboard-toc-nav, .dashboard-toc');
      var stickyBottom = br.bottom;
      if (toc) {
        var tcs = window.getComputedStyle(toc);
        var tr = toc.getBoundingClientRect();
        if (tcs.display !== 'none' && tcs.visibility !== 'hidden' && tr.height >= 4) {
          stickyBottom = Math.max(stickyBottom, tr.bottom);
        }
      }
      var gapPx = 12;
      var inset = Math.max(48, Math.ceil(stickyBottom - cr.top) + gapPx);
      dash.style.setProperty('--dash-scroll-inset', inset + 'px');
    } catch (eDash) { }
  }
  function run() {
    requestAnimationFrame(function () {
      syncHeaderHeight();
      syncDashboardScrollOffsetsImpl();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  window.addEventListener('resize', run);
  window.addEventListener('load', run);
  try {
    var hdrObs = document.querySelector('header.site-header');
    if (hdrObs && typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(run).observe(hdrObs);
    }
  } catch (eRO) { }
  try {
    var dashEl = document.getElementById('dashboard-overlay');
    var dashBar = dashEl && dashEl.querySelector('.dashboard-header-bar');
    if (dashBar && typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(run).observe(dashBar);
    }
    var dashToc = dashEl && dashEl.querySelector('#dashboard-toc-nav, .dashboard-toc');
    if (dashToc && typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(run).observe(dashToc);
    }
  } catch (eRO2) { }
  try {
    window.IIF_syncDashboardScrollOffsets = syncDashboardScrollOffsetsImpl;
  } catch (eEx) { }
})();
