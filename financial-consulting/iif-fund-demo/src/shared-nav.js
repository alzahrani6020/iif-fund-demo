/* ═══════════════════════════════════════════════════════════════
   Sovereign Shared Navigation — IIF
   شريط التنقل الموحد لجميع الصفحات
   ═══════════════════════════════════════════════════════════════ */

const SOV_NAV_LINKS = [
  { href: './', labelAr: 'الرئيسية', labelEn: 'Home' },
  { href: 'about', labelAr: 'من نحن', labelEn: 'About' },
  { href: 'strategy', labelAr: 'الاستراتيجية', labelEn: 'Strategy' },
  { href: 'services', labelAr: 'الخدمات', labelEn: 'Services' },
  { href: 'portfolio', labelAr: 'المحفظة', labelEn: 'Portfolio' },
  { href: 'partnerships', labelAr: 'الشراكات', labelEn: 'Partnerships' },
  { href: 'press', labelAr: 'الإعلام', labelEn: 'Press' },
  { href: 'reports', labelAr: 'التقارير', labelEn: 'Reports' },
  { href: 'careers', labelAr: 'الوظائف', labelEn: 'Careers' },
  { href: 'faq', labelAr: 'الأسئلة الشائعة', labelEn: 'FAQ' },
  { href: 'contact', labelAr: 'التواصل', labelEn: 'Contact' },
  { href: 'apply', labelAr: 'طلب عضوية', labelEn: 'Apply' },
];

const SOV_LANGS = [
  { code: 'ar', label: 'AR' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'zh', label: 'ZH' },
];

const LANG_STORAGE_KEY = 'iif-lang';

function getStoredLang() {
  try { return localStorage.getItem(LANG_STORAGE_KEY) || 'ar'; }
  catch (e) { return 'ar'; }
}

function setStoredLang(lang) {
  try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (e) {}
}

function detectPage() {
  const path = window.location.pathname;
  if (path.endsWith('/')) return 'home';
  if (path.includes('about')) return 'about';
  if (path.includes('strategy')) return 'strategy';
  if (path.includes('partnerships')) return 'partnerships';
  if (path.includes('press')) return 'press';
  if (path.includes('contact')) return 'contact';
  return 'home';
}

function injectNav() {
  const lang = getStoredLang();
  const isAr = lang === 'ar';
  const currentPage = detectPage();

  // Remove existing nav
  const existing = document.getElementById('sov-nav');
  if (existing) existing.remove();

  const nav = document.createElement('nav');
  nav.id = 'sov-nav';
  nav.className = 'sov-nav';
  nav.setAttribute('aria-label', isAr ? 'التنقل الرئيسي' : 'Main navigation');

  const linksHtml = SOV_NAV_LINKS.map(link => {
    const pageId = link.href === './' ? 'home' : link.href;
    const isActive = currentPage === pageId;
    const label = isAr ? link.labelAr : link.labelEn;
    const href = link.href === './' ? './' : link.href;
    return `<a href="${href}" class="sov-nav__link ${isActive ? 'sov-nav__link--active' : ''}" ${isActive ? 'aria-current="page"' : ''}>${label}</a>`;
  }).join('');

  const langHtml = SOV_LANGS.map(l => {
    const isActive = lang === l.code;
    return `<button type="button" class="lang-switcher__btn ${isActive ? 'lang-switcher__btn--active' : ''}" data-lang="${l.code}" aria-label="${l.code.toUpperCase()}">${l.label}</button>`;
  }).join('');

  const ctaLabel = isAr ? 'استفسار سيادي' : 'Sovereign Inquiry';
  const brandTitle = isAr ? 'الصندوق الدولي للاستثمار' : (lang === 'fr' ? 'Fonds International d\'Investissement' : 'International Investment Fund');
  const brandSubtitle = isAr ? 'FII · باريس' : 'FII · PARIS';

  nav.innerHTML = `
    <div class="sov-container">
      <div class="sov-nav__inner">
        <a href="./" class="sov-nav__brand" aria-label="${isAr ? 'الرئيسية' : 'Home'}">
          <img src="assets/logo-192.png" alt="FII" class="sov-nav__logo" width="40" height="40" loading="eager" />
          <div class="sov-nav__brand-text">
            <span class="sov-nav__brand-title">${brandTitle}</span>
            <span class="sov-nav__brand-subtitle">${brandSubtitle}</span>
          </div>
        </a>
        <div class="sov-nav__links">
          ${linksHtml}
        </div>
        <div class="sov-flex" style="gap:var(--space-3);">
          <a href="contact" class="sov-btn sov-btn--outline-gold sov-btn--sm sov-nav__cta">${ctaLabel}</a>
          <div class="lang-switcher">${langHtml}</div>
        </div>
        <button type="button" class="sov-nav__menu-btn" aria-label="${isAr ? 'فتح القائمة' : 'Open menu'}" aria-expanded="false" aria-controls="sov-nav-mobile">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
      <div class="sov-nav__mobile" id="sov-nav-mobile" aria-hidden="true">
        ${linksHtml}
        <div style="margin-top:var(--space-4); padding-top:var(--space-4); border-top:1px solid var(--color-border);">
          <a href="contact" class="sov-btn sov-btn--outline-gold" style="width:100%;">${ctaLabel}</a>
        </div>
        <div class="lang-switcher" style="margin-top:var(--space-4); justify-content:center;">
          ${langHtml}
        </div>
      </div>
    </div>
  `;

  document.body.insertBefore(nav, document.body.firstChild);

  // Scroll handler for nav background
  let scrolled = false;
  function onScroll() {
    const shouldScroll = window.scrollY > 40;
    if (shouldScroll !== scrolled) {
      scrolled = shouldScroll;
      nav.classList.toggle('sov-nav--scrolled', scrolled);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  const menuBtn = nav.querySelector('.sov-nav__menu-btn');
  const mobileMenu = nav.querySelector('.sov-nav__mobile');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !expanded);
      mobileMenu.setAttribute('aria-hidden', expanded);
    });
  }

  // Language switcher
  nav.querySelectorAll('.lang-switcher__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newLang = btn.dataset.lang;
      if (newLang && newLang !== getStoredLang()) {
        setStoredLang(newLang);
        window.location.reload();
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectNav);
} else {
  injectNav();
}
