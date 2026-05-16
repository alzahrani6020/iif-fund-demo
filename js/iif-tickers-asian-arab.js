/* شريطا الأسواق الآسيوية والعربية — مربوطة بالأسواق فقط (مصادر اقتصادية)، حركة مستمرة تُكرر من جديد */
/* يُحمّل بعد js/iif-index-app-bundle.js (يتطلب window.ensureHttpsUrl و window.IIF_FUNCS_PREFIX). */
(function loadTickersAsianArab() {
  var LS_ASIAN = 'iif-ticker-country-asian';
  var LS_ARAB = 'iif-ticker-country-arab';
  var LS_PAUSED = 'iif-ticker-paused';
  var LS_BILINGUAL = 'iif-ticker-bilingual';
  var copyAsian = document.getElementById('ticker-asian-copy');
  var copyAsian2 = document.getElementById('ticker-asian-copy2');
  var copyArab = document.getElementById('ticker-arab-copy');
  var copyArab2 = document.getElementById('ticker-arab-copy2');
  if (!copyAsian || !copyAsian2) copyAsian = copyAsian2 = null;
  if (!copyArab || !copyArab2) copyArab = copyArab2 = null;
  if (!copyAsian && !copyArab) return;
  function restoreTickerCountries() {
    try {
      var ea = document.getElementById('iif-ticker-country-asian');
      var va = localStorage.getItem(LS_ASIAN) || '';
      if (ea && va && ea.querySelector('option[value="' + va + '"]')) ea.value = va;
      var er = document.getElementById('iif-ticker-country-arab');
      var vr = localStorage.getItem(LS_ARAB) || '';
      if (er && vr && er.querySelector('option[value="' + vr + '"]')) er.value = vr;
    } catch (eR) { }
  }
  restoreTickerCountries();
  (function initTickerBilingualToggle() {
    try {
      var cb = document.getElementById('iif-ticker-bilingual');
      if (!cb) return;
      var on = false;
      try { on = localStorage.getItem(LS_BILINGUAL) === '1'; } catch (e) { }
      if (on) document.documentElement.setAttribute('data-iif-ticker-bilingual', '1');
      cb.checked = !!on;
      cb.addEventListener('change', function () {
        var v = !!cb.checked;
        try {
          if (v) document.documentElement.setAttribute('data-iif-ticker-bilingual', '1');
          else document.documentElement.removeAttribute('data-iif-ticker-bilingual');
        } catch (e2) { }
        try { localStorage.setItem(LS_BILINGUAL, v ? '1' : '0'); } catch (e3) { }
        try { if (typeof window.IIF_applyTickerDurations === 'function') window.IIF_applyTickerDurations(); } catch (e4) { }
      });
    } catch (e0) { }
  })();
  function getCountryForCat(cat) {
    try {
      if (cat === 'asian') {
        var el = document.getElementById('iif-ticker-country-asian');
        var v = el && el.value ? String(el.value).toUpperCase().trim() : '';
        return /^[A-Z]{2}$/.test(v) ? v : '';
      }
      if (cat === 'arabic') {
        var el2 = document.getElementById('iif-ticker-country-arab');
        var v2 = el2 && el2.value ? String(el2.value).toUpperCase().trim() : '';
        return /^[A-Z]{2}$/.test(v2) ? v2 : '';
      }
    } catch (eC) { }
    return '';
  }
  (function initTickerToolbarPause() {
    var wrap = document.querySelector('.site-header__tickers');
    var btn = document.getElementById('iif-ticker-motion-toggle');
    if (!wrap || !btn) return;
    function updatePauseLabel(paused) {
      var key = paused ? 'tickerMotionResume' : 'tickerMotionPause';
      try {
        if (window.IIF_I18N && typeof window.IIF_I18N.text === 'function') {
          var tx = window.IIF_I18N.text(key);
          if (tx) { btn.textContent = tx; return; }
        }
      } catch (eL) { }
      btn.textContent = paused ? 'Resume' : 'Pause';
    }
    function setPaused(on, opts) {
      opts = opts || {};
      var persist = opts.persist !== false; // default: persist
      wrap.classList.toggle('site-header__tickers--paused', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (persist) { try { localStorage.setItem(LS_PAUSED, on ? '1' : '0'); } catch (eP) { } }
      updatePauseLabel(on);
    }
    try {
      var stored = localStorage.getItem(LS_PAUSED);
      if (stored === '1') setPaused(true, { persist: true });
      else if (stored === '0') setPaused(false, { persist: true });
      else {
        var isMobile = false;
        try { isMobile = window.matchMedia && window.matchMedia('(max-width: 720px)').matches; } catch (eM) { }
        var reduce = false;
        try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (eR) { }
        if (isMobile || reduce) setPaused(true, { persist: false }); // default pause on mobile unless user chose otherwise
        else updatePauseLabel(false);
      }
    } catch (eI) { updatePauseLabel(false); }
    btn.addEventListener('click', function () {
      setPaused(!wrap.classList.contains('site-header__tickers--paused'), { persist: true });
    });
    window.addEventListener('iif-lang-change', function () {
      updatePauseLabel(wrap.classList.contains('site-header__tickers--paused'));
      try { if (typeof window.IIF_applyTickerDurations === 'function') window.IIF_applyTickerDurations(); } catch (e) { }
    });

    // Mobile UX: pause tickers while the user interacts (read/copy/click).
    (function bindPauseOnTouch() {
      var timer = 0;
      function pauseTemporarily(ms) {
        try {
          if (wrap.classList.contains('site-header__tickers--paused')) return; // user explicitly paused
          setPaused(true, { persist: false });
          clearTimeout(timer);
          timer = setTimeout(function () {
            try { setPaused(false, { persist: false }); } catch (e2) { }
          }, Math.max(600, ms | 0));
        } catch (e) { }
      }
      function isInsideTicker(el) {
        try { return !!(el && el.closest && el.closest('.site-header__tickers')); } catch (e) { return false; }
      }
      // Pointer/touch interactions
      wrap.addEventListener('pointerdown', function (e) {
        if (!isInsideTicker(e && e.target)) return;
        pauseTemporarily(9000);
      }, { passive: true });
      wrap.addEventListener('touchstart', function () { pauseTemporarily(9000); }, { passive: true });
      wrap.addEventListener('touchmove', function () { pauseTemporarily(9000); }, { passive: true });
      wrap.addEventListener('mouseenter', function () { pauseTemporarily(4500); });
      wrap.addEventListener('mouseleave', function () {
        try {
          if (wrap.classList.contains('site-header__tickers--paused')) return;
          clearTimeout(timer);
          timer = setTimeout(function () {
            try { setPaused(false, { persist: false }); } catch (e2) { }
          }, 250);
        } catch (e) { }
      });
    })();
  })();
  var selAsian = document.getElementById('iif-ticker-country-asian');
  if (selAsian) selAsian.addEventListener('change', function () {
    try { localStorage.setItem(LS_ASIAN, this.value || ''); } catch (e) { }
    if (typeof window.IIF_reloadTickers === 'function') window.IIF_reloadTickers();
  });
  var selArab = document.getElementById('iif-ticker-country-arab');
  if (selArab) selArab.addEventListener('change', function () {
    try { localStorage.setItem(LS_ARAB, this.value || ''); } catch (e) { }
    if (typeof window.IIF_reloadTickers === 'function') window.IIF_reloadTickers();
  });
  function escapeHtml(s) { return String(s).replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function ensureRepeatCopies(copy1, copy2) {
    try {
      if (!copy1 || !copy2) return;
      if (!String(copy2.innerHTML || '').trim()) copy2.innerHTML = copy1.innerHTML || '';
    } catch (e) { }
  }
  function applyTickerDuration(trackId) {
    try {
      var track = document.getElementById(trackId);
      if (!track) return;
      var w = track.scrollWidth || 0;
      if (!w) return;
      // ~26 px/sec target (slower) → seconds = width / 26. Clamp to sane bounds.
      var seconds = clamp(Math.round(w / 26), 90, 260);
      track.style.setProperty('--iif-ticker-duration', seconds + 's');
    } catch (e) { }
  }
  function applyAllTickerDurations() {
    applyTickerDuration('ticker-track');
    applyTickerDuration('ticker-asian-track');
    applyTickerDuration('ticker-arab-track');
  }
  try { window.IIF_applyTickerDurations = applyAllTickerDurations; } catch (e) { }
  function tickerDisplayTitles(item) {
    var fb = item.title || '';
    var te = item.titleEn;
    var ta = item.titleAr;
    var hasEn = te != null && String(te).trim().length > 0;
    var hasAr = ta != null && String(ta).trim().length > 0;
    return {
      titleEn: hasEn ? String(te).trim() : (hasAr ? String(ta).trim() : fb),
      titleAr: hasAr ? String(ta).trim() : (hasEn ? String(te).trim() : fb)
    };
  }
  function renderTickerBilingual(items, copy1, copy2) {
    var html = '';
    if (!items || items.length === 0) {
      var emptyMsg = 'No items at the moment.';
      try {
        if (window.IIF_I18N && typeof window.IIF_I18N.text === 'function') {
          var t0 = window.IIF_I18N.text('tickerNoItemsNow');
          if (t0) emptyMsg = t0;
        }
      } catch (eTi) { }
      html = '<span class="ticker-item" style="pointer-events:none;"><span>' + escapeHtml(emptyMsg) + '</span></span>';
    } else {
      items.forEach(function (item) {
        var link = (item.link || '#').replace(/"/g, '&quot;');
        var dt = tickerDisplayTitles(item);
        var titleEn = escapeHtml(dt.titleEn);
        var titleAr = escapeHtml(dt.titleAr);
        var src = (item.source) ? ' <span>' + escapeHtml(item.source) + '</span>' : '';
        html += '<a href="' + link + '" target="_blank" rel="noopener noreferrer" class="ticker-item"><span class="lang-en">' + titleEn + '</span><span class="lang-ar">' + titleAr + '</span>' + src + '</a>';
      });
    }
    if (copy1) copy1.innerHTML = html || '';
    if (copy2) copy2.innerHTML = html || '';
    ensureRepeatCopies(copy1, copy2);
    if (typeof window.IIF_restartTickerMarquees === 'function') window.IIF_restartTickerMarquees();
    setTimeout(applyAllTickerDurations, 0);
  }
  function loadCat(cat, copy1, copy2) {
    if (!copy1 || !copy2) return;
    var base = (typeof window !== 'undefined' && window.IIF_FUNCS_BASE && window.IIF_FUNCS_BASE.trim()) ? window.IIF_FUNCS_BASE.trim() : '';
    if (!base && document.querySelector) { var meta = document.querySelector('meta[name="iif-funcs-base"]'); base = (meta && meta.getAttribute('content')) ? meta.getAttribute('content').trim() : ''; }
    base = typeof window.ensureHttpsUrl === 'function' ? window.ensureHttpsUrl(base) : base;
    /* على خادم التطوير 3333: /api/news من نفس المنشأ (scripts/dev-server.js) وليس نشر Vercel قديم يعيد نص MyMemory */
    try {
      if (typeof location !== 'undefined' && location.hostname === '127.0.0.1' && String(location.port || '') === '3333') base = '';
    } catch (eLoc) { }
    var docLangTicker = (document.documentElement.getAttribute('data-lang') || document.documentElement.lang || 'en').toLowerCase().trim() || 'en';
    try {
      var spLang = new URLSearchParams(window.location.search || '');
      var qLang = (spLang.get('lang') || '').trim().toLowerCase();
      if (qLang) docLangTicker = qLang;
    } catch (eQ) { }
    var qs = '?lang=' + encodeURIComponent(docLangTicker) + '&cat=' + encodeURIComponent(cat);
    var cc = getCountryForCat(cat);
    if (cc) qs += '&country=' + encodeURIComponent(cc);
    var prefix = (typeof window.IIF_FUNCS_PREFIX !== 'undefined' && window.IIF_FUNCS_PREFIX != null) ? window.IIF_FUNCS_PREFIX : '/api';
    var api = (base ? base : '') + prefix + '/news' + qs;
    fetch(api).then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('')); }).then(function (data) {
      var items = (data && data.items && data.items.length) ? data.items : [];
      var slice = items.slice(0, 20);
      /* بدون عناصر: نُبقي روابط HTML الافتراضية ولا نستبدلها برسالة فارغة */
      if (!slice.length) return;
      // Reject "diagnostic" / placeholder payloads (sometimes returned by upstream translation layers).
      try {
        var badRx = /(LANGPAIR=|ALMOST\\s+ALL\\s+LANGUAGES\\s+SUPPORTED|SUPPORTED\\s+BUT\\s+SOME\\s+MAY\\s+HAVE\\s+NO\\s+CONTENT)/i;
        var hasBad = slice.some(function (it) {
          var t = (it && (it.titleAr || it.titleEn || it.title) ? String(it.titleAr || it.titleEn || it.title) : '');
          return badRx.test(t);
        });
        if (hasBad) return; // keep static HTML
      } catch (eBad) { }
      /* titleEn/titleAr من الـ API عند التمييز؛ وإلا title واحد للاثنين */
      var bilingual = slice.map(function (it) {
        return { title: it.title, titleEn: it.titleEn, titleAr: it.titleAr, link: it.link, source: it.source };
      });
      renderTickerBilingual(bilingual, copy1, copy2);
    }).catch(function () { /* فشل الشبكة أو لا يوجد خادم: الإبقاء على المحتوى الثابت */ });
  }
  function reload() {
    if (copyAsian && copyAsian2) loadCat('asian', copyAsian, copyAsian2);
    if (copyArab && copyArab2) loadCat('arabic', copyArab, copyArab2);
    // Keep default HTML seamless even if API is unreachable.
    if (copyAsian && copyAsian2) ensureRepeatCopies(copyAsian, copyAsian2);
    if (copyArab && copyArab2) ensureRepeatCopies(copyArab, copyArab2);
    setTimeout(applyAllTickerDurations, 0);
  }
  reload();
  window.IIF_reloadTickers = reload;
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      if (typeof window.IIF_restartTickerMarquees === 'function') window.IIF_restartTickerMarquees();
    });
  });
})();
