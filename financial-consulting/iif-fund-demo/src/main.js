import { sections } from './sections/index.js';
import { loadLang } from './i18n/loader.js';

const DEFAULT_LANG = 'ar';
const LANG_STORAGE_KEY = 'iif-lang';

async function init() {
  const root = document.documentElement;
  let lang = DEFAULT_LANG;
  try { lang = localStorage.getItem(LANG_STORAGE_KEY) || DEFAULT_LANG; } catch (e) {}

  // Load translations
  const translations = await loadLang(lang);

  // Apply lang attributes
  root.setAttribute('data-lang', lang);
  root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  root.setAttribute('lang', lang);

  const app = document.getElementById('app');
  if (!app) return;

  // Render all sections
  const sectionOrder = [
    'hero', 'about', 'about_team', 'services', 'sectors', 'mission',
    'business_council', 'leadership', 'history', 'contact',
    'members', 'suggest', 'financial_consultation',
    'urgent_consultation_online', 'hizkama', 'activities',
    'compliance', 'how', 'council', 'membership',
    'financing_request', 'feasibility_study',
    'investor_registration', 'upload_submit',
    'budget_analysis', 'user_dashboard',
    'feasibility_analysis', 'translation',
    'join_us', 'partners', 'customer_experience',
    'verification_tools', 'careers', 'terms',
    'page_representative', 'page_research_center'
  ];

  for (const key of sectionOrder) {
    const renderFn = sections[key];
    if (renderFn) {
      const wrapper = document.createElement('div');
      wrapper.id = `section-${key}`;
      app.appendChild(wrapper);
      renderFn(wrapper, lang);
    }
  }

  // Apply translations to data-i18n elements
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
