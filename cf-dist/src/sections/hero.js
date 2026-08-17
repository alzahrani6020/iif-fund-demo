export function render(container, lang = "ar") {
  const isAr = lang === 'ar';
  container.innerHTML = `
<section id="hero" class="hero">
  <div class="hero__bg" aria-hidden="true">
    <div class="hero__orb hero__orb--gold"></div>
    <div class="hero__orb hero__orb--blue"></div>
  </div>
  <div class="hero__content">
    <div class="hero__eyebrow">
      <span class="hero__badge">FII · Paris</span>
      <span class="hero__pulse"></span>
      <span class="hero__status">${isAr ? 'نشط عالمياً' : 'Active globally'}</span>
    </div>
    <div class="hero__emblem" aria-hidden="true">
      <img src="assets/logo.jpg" alt="International Investment Fund" class="hero__emblem-img" width="120" height="120" />
    </div>
    <h1 class="hero__title hero__title--gradient">
      <span class="lang-en">International Investment Fund</span>
      <span class="lang-ar">صندوق الاستثمار الدولي</span>
    </h1>
    <p class="hero__mission">
      <span class="lang-en">Financing for global prosperity · Sovereign partnerships · Institutional capital</span>
      <span class="lang-ar">تمويل الازدهار العالمي · شراكات سيادية · رأس مال مؤسسي</span>
    </p>
    <div class="hero__divider" aria-hidden="true"></div>
    <div class="hero__actions">
      <a href="#services" class="btn btn--primary btn--lg hero__btn--glow">
        <span class="lang-en">Explore Services</span>
        <span class="lang-ar">استكشف الخدمات</span>
      </a>
      <a href="#contact" class="btn btn--ghost btn--lg">
        <span class="lang-en">Get in Touch</span>
        <span class="lang-ar">تواصل معنا</span>
      </a>
    </div>
    <div class="hero__stats">
      <div class="hero__stat">
        <span class="hero__stat-value" data-count="50">0</span><span class="hero__stat-suffix">+</span>
        <span class="hero__stat-label">${isAr ? 'دولة' : 'Countries'}</span>
      </div>
      <div class="hero__stat">
        <span class="hero__stat-value" data-count="2">0</span><span class="hero__stat-suffix">B$+</span>
        <span class="hero__stat-label">${isAr ? 'أصول مدارة' : 'AUM'}</span>
      </div>
      <div class="hero__stat">
        <span class="hero__stat-value">2019</span>
        <span class="hero__stat-label">${isAr ? 'التأسيس' : 'Founded'}</span>
      </div>
      <div class="hero__stat">
        <span class="hero__stat-value">EU</span>
        <span class="hero__stat-label">${isAr ? 'الترخيص' : 'Licensed'}</span>
      </div>
    </div>
  </div>
</section>
  `.trim();

  // Animate stats counter
  requestAnimationFrame(() => {
    container.querySelectorAll('.hero__stat-value[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1500;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  });
}
