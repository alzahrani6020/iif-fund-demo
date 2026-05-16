// Shared init for standalone pages (services.html, about.html, etc.)
// Injects: top navigation, unified footer, language toggle, i18n hydration

import { loadLang } from './i18n/loader.js';

const DEFAULT_LANG = 'ar';
const LANG_STORAGE_KEY = 'iif-lang';

function getStoredLang() {
  try { return localStorage.getItem(LANG_STORAGE_KEY) || DEFAULT_LANG; } catch (e) { return DEFAULT_LANG; }
}

function setLang(lang) {
  try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (e) {}
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);
}

function t(translations, key) {
  return translations[key] || key;
}

function renderNav(lang, translations) {
  const isAr = lang === 'ar';
  const nav = document.createElement('nav');
  nav.className = 'shared-nav';
  nav.setAttribute('aria-label', isAr ? 'التنقل الرئيسي' : 'Main navigation');
  nav.innerHTML = `
    <div class="shared-nav__inner">
      <a href="index.html" class="shared-nav__brand" aria-label="FII Home">
        <span class="shared-nav__logo">FII</span>
        <span class="shared-nav__title">
          <span class="lang-en">International Investment Fund</span>
          <span class="lang-ar">صندوق الاستثمار الدولي</span>
        </span>
      </a>
      <div class="shared-nav__links">
        <a href="index.html" class="shared-nav__link">
          <span class="lang-en">Home</span>
          <span class="lang-ar">الرئيسية</span>
        </a>
        <a href="about.html" class="shared-nav__link">
          <span class="lang-en">About</span>
          <span class="lang-ar">عن الصندوق</span>
        </a>
        <a href="services.html" class="shared-nav__link">
          <span class="lang-en">Services</span>
          <span class="lang-ar">الخدمات</span>
        </a>
        <a href="index.html#contact" class="shared-nav__link">
          <span class="lang-en">Contact</span>
          <span class="lang-ar">التواصل</span>
        </a>
      </div>
      <button type="button" class="shared-nav__lang" aria-label="${isAr ? 'Switch to English' : 'التبديل إلى العربية'}" title="${isAr ? 'English' : 'العربية'}">
        <span class="shared-nav__lang-code">${isAr ? 'EN' : 'AR'}</span>
      </button>
      <button type="button" class="shared-nav__menu" aria-label="${isAr ? 'فتح القائمة' : 'Open menu'}" aria-expanded="false" aria-controls="shared-nav-menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="shared-nav__mobile" id="shared-nav-menu" hidden>
      <a href="index.html" class="shared-nav__mobile-link">
        <span class="lang-en">Home</span>
        <span class="lang-ar">الرئيسية</span>
      </a>
      <a href="about.html" class="shared-nav__mobile-link">
        <span class="lang-en">About</span>
        <span class="lang-ar">عن الصندوق</span>
      </a>
      <a href="services.html" class="shared-nav__mobile-link">
        <span class="lang-en">Services</span>
        <span class="lang-ar">الخدمات</span>
      </a>
      <a href="index.html#contact" class="shared-nav__mobile-link">
        <span class="lang-en">Contact</span>
        <span class="lang-ar">التواصل</span>
      </a>
    </div>
  `;

  // Language toggle
  nav.querySelector('.shared-nav__lang').addEventListener('click', () => {
    const next = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
    window.location.reload();
  });

  // Mobile menu toggle
  const menuBtn = nav.querySelector('.shared-nav__menu');
  const mobileMenu = nav.querySelector('.shared-nav__mobile');
  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.hidden = expanded;
  });

  return nav;
}

function renderFooter(lang) {
  const isAr = lang === 'ar';
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.id = 'site-footer';
  footer.innerHTML = `
    <div class="footer-brand">International Investment Fund</div>
    <div class="footer-links">
      <a href="index.html#about">${isAr ? 'عن الصندوق' : 'About'}</a>
      <a href="index.html#services">${isAr ? 'الخدمات' : 'Services'}</a>
      <a href="index.html#sectors">${isAr ? 'القطاعات' : 'Sectors'}</a>
      <a href="index.html#contact">${isAr ? 'التواصل' : 'Contact'}</a>
      <a href="index.html#terms">${isAr ? 'الشروط' : 'Terms'}</a>
      <a href="privacy.html">${isAr ? 'الخصوصية' : 'Privacy'}</a>
    </div>
    <div class="footer-copy">
      © ${new Date().getFullYear()} International Investment Fund · ${isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
    </div>
  `;
  return footer;
}

async function init() {
  const lang = getStoredLang();
  setLang(lang);

  // Load translations for data-i18n hydration
  const translations = await loadLang(lang);

  // Inject nav
  const headerPlaceholder = document.getElementById('shared-header');
  const nav = renderNav(lang, translations);
  if (headerPlaceholder) {
    headerPlaceholder.replaceWith(nav);
  } else {
    document.body.prepend(nav);
  }

  // Replace inline footer with shared footer if present
  const existingFooter = document.querySelector('body > footer');
  const footer = renderFooter(lang);
  if (existingFooter) {
    existingFooter.replaceWith(footer);
  } else {
    document.body.appendChild(footer);
  }

  // Hydrate data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
