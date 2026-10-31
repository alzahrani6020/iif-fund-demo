(function () {
  var SUPPORTED = ['ar', 'en', 'fr', 'zh'];
  var lang = null;
  try {
    var q = (new URLSearchParams(location.search).get('lang') || '').toLowerCase();
    if (SUPPORTED.indexOf(q) >= 0) {
      lang = q;
      try { localStorage.setItem('iif-lang', q); } catch (e) {}
    }
  } catch (e) {}
  if (!lang) { try { lang = localStorage.getItem('iif-lang'); } catch (e) {} }
  if (SUPPORTED.indexOf(lang) < 0) lang = 'ar';
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);
})();
