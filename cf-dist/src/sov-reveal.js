/* ═══════════════════════════════════════════════════════════════
   Sovereign Scroll Reveal — IIF
   تأثير الظهور عند التمرير
   ═══════════════════════════════════════════════════════════════ */

(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sov-reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  });

  function init() {
    document.querySelectorAll('.sov-reveal').forEach(el => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
