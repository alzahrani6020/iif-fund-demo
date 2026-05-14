export function render(container, lang = "ar") {
  container.innerHTML = `
<section id="hero" class="hero">
  <div class="hero__eyebrow">
    <span class="hero__badge">FII · Paris</span>
    <span class="hero__status">🟢 ${lang === 'ar' ? 'نشط عالمياً' : 'Active globally'}</span>
  </div>
  <h1 class="hero__title">
    <span class="lang-en">International Investment Fund</span>
    <span class="lang-ar">صندوق الاستثمار الدولي</span>
  </h1>
  <p class="hero__mission">
    <span class="lang-en">Financing for global prosperity · Sovereign partnerships · Institutional capital</span>
    <span class="lang-ar">تمويل الازدهار العالمي · شراكات سيادية · رأس مال مؤسسي</span>
  </p>
  <div class="hero__actions">
    <a href="#services" class="btn btn--primary">
      <span class="lang-en">Services &amp; Consultation</span>
      <span class="lang-ar">خدمات واستشارة</span>
    </a>
    <a href="#about" class="btn btn--ghost">
      <span class="lang-en">About the Fund</span>
      <span class="lang-ar">عن الصندوق</span>
    </a>
  </div>
  <div class="hero__stats">
    <div class="hero__stat">
      <span class="hero__stat-value">50+</span>
      <span class="hero__stat-label">${lang === 'ar' ? 'دولة' : 'Countries'}</span>
    </div>
    <div class="hero__stat">
      <span class="hero__stat-value">$2B+</span>
      <span class="hero__stat-label">${lang === 'ar' ? 'أصول مدارة' : 'AUM'}</span>
    </div>
    <div class="hero__stat">
      <span class="hero__stat-value">2019</span>
      <span class="hero__stat-label">${lang === 'ar' ? 'التأسيس' : 'Founded'}</span>
    </div>
    <div class="hero__stat">
      <span class="hero__stat-value">EU</span>
      <span class="hero__stat-label">${lang === 'ar' ? 'الترخيص' : 'Licensed'}</span>
    </div>
  </div>
</section>
  `.trim();
}
