export function render(container, lang = "ar") {
  const isAr = lang === 'ar';
  container.innerHTML = `
<footer class="site-footer" id="site-footer">
  <div class="footer-brand">International Investment Fund</div>
  <div class="footer-links">
    <a href="#about">${isAr ? 'عن الصندوق' : 'About'}</a>
    <a href="#services">${isAr ? 'الخدمات' : 'Services'}</a>
    <a href="#sectors">${isAr ? 'القطاعات' : 'Sectors'}</a>
    <a href="#contact">${isAr ? 'التواصل' : 'Contact'}</a>
    <a href="#terms">${isAr ? 'الشروط' : 'Terms'}</a>
    <a href="privacy.html">${isAr ? 'الخصوصية' : 'Privacy'}</a>
  </div>
  <div class="footer-copy">
    © ${new Date().getFullYear()} International Investment Fund · ${isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
  </div>
</footer>
  `.trim();
}
