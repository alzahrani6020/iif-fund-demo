/* ═══════════════════════════════════════════════════════════════
   Sovereign Shared Footer — IIF
   التذييل الموحد لجميع الصفحات
   ═══════════════════════════════════════════════════════════════ */

const SOV_FOOTER_COLS = [
  {
    titleAr: 'الصندوق',
    titleEn: 'Fund',
    links: [
      { href: 'about', ar: 'من نحن', en: 'About' },
      { href: 'strategy', ar: 'الاستراتيجية', en: 'Strategy' },
      { href: 'partnerships', ar: 'الشراكات', en: 'Partnerships' },
      { href: 'press', ar: 'الإعلام', en: 'Press' },
    ],
  },
  {
    titleAr: 'الحوكمة',
    titleEn: 'Governance',
    links: [
      { href: 'sovereign-standards.html', ar: 'معايير سيادية', en: 'Sovereign Standards' },
      { href: 'executive-brief.html', ar: 'موجز تنفيذي', en: 'Executive Brief' },
      { href: '#', ar: 'التقارير السنوية', en: 'Annual Reports' },
      { href: '#', ar: 'الامتثال', en: 'Compliance' },
    ],
  },
  {
    titleAr: 'التواصل',
    titleEn: 'Connect',
    links: [
      { href: 'contact', ar: 'اتصل بنا', en: 'Contact' },
      { href: 'mailto:info@iiffund.com', ar: 'info@iiffund.com', en: 'info@iiffund.com' },
      { href: 'tel:+966567566616', ar: '+966 56 756 6616', en: '+966 56 756 6616' },
      { href: 'https://github.com/alzahrani6020/iif-fund-demo', ar: 'GitHub', en: 'GitHub' },
    ],
  },
];

const LANG_STORAGE_KEY = 'iif-lang';

function getStoredLang() {
  try { return localStorage.getItem(LANG_STORAGE_KEY) || 'ar'; }
  catch (e) { return 'ar'; }
}

function injectFooter() {
  const lang = getStoredLang();
  const isAr = lang === 'ar';
  const year = new Date().getFullYear();

  const existing = document.getElementById('sov-footer');
  if (existing) existing.remove();

  const colsHtml = SOV_FOOTER_COLS.map(col => {
    const title = isAr ? col.titleAr : col.titleEn;
    const linksHtml = col.links.map(link => {
      const label = isAr ? link.ar : link.en;
      const isExternal = link.href.startsWith('http') || link.href.startsWith('mailto') || link.href.startsWith('tel');
      return `<a href="${link.href}" class="sov-footer__link" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    }).join('');
    return `
      <div>
        <div class="sov-footer__col-title">${title}</div>
        <div class="sov-footer__links">${linksHtml}</div>
      </div>
    `;
  }).join('');

  const tagline = isAr
    ? 'صندوق الاستثمار الدولي — تمويل الازدهار العالمي من خلال الشراكات السيادية ورأس المال المؤسسي.'
    : 'International Investment Fund — Financing for global prosperity through sovereign partnerships and institutional capital.';

  const legalPrivacy = isAr ? 'سياسة الخصوصية' : 'Privacy Policy';
  const legalTerms = isAr ? 'الشروط والأحكام' : 'Terms of Use';
  const legalDisclaimer = isAr ? 'إخلاء المسؤولية' : 'Disclaimer';
  const legalCookies = isAr ? 'ملفات تعريف الارتباط' : 'Cookies';

  const footer = document.createElement('footer');
  footer.id = 'sov-footer';
  footer.className = 'sov-footer';

  footer.innerHTML = `
    <div class="sov-container">
      <div class="sov-footer__grid">
        <div class="sov-footer__brand">
          <div class="sov-flex" style="gap:var(--space-3);">
            <img src="assets/logo-192.webp" alt="FII" class="sov-footer__logo" width="48" height="48" loading="lazy" decoding="async" />
            <div>
              <div class="sov-nav__brand-title" style="font-size:var(--text-base);">International Investment Fund</div>
              <div class="sov-nav__brand-subtitle">FII · PARIS</div>
            </div>
          </div>
          <p class="sov-footer__tagline">${tagline}</p>
          <div class="sov-flex" style="gap:var(--space-3); margin-top:var(--space-2);">
            <span class="sov-badge sov-badge--gold">EU Transparency Register</span>
            <span class="sov-badge sov-badge--navy">Paris · Riyadh</span>
          </div>
        </div>
        ${colsHtml}
      </div>
      <div class="sov-footer__bottom">
        <span>© ${year} International Investment Fund. ${isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</span>
        <div class="sov-footer__legal">
          <a href="legal/privacy.html">${legalPrivacy}</a>
          <a href="legal/disclaimer.html">${legalTerms}</a>
          <a href="legal/disclaimer.html">${legalDisclaimer}</a>
          <a href="#">${legalCookies}</a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(footer);
}

function scheduleInjectFooter() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(injectFooter, { timeout: 2000 });
  } else {
    setTimeout(injectFooter, 1);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleInjectFooter);
} else {
  scheduleInjectFooter();
}
