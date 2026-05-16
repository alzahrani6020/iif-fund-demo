// Language toggle widget — injects a floating button for homepage SPA
const LANG_STORAGE_KEY = 'iif-lang';
const DEFAULT_LANG = 'ar';

function getLang() {
  try { return localStorage.getItem(LANG_STORAGE_KEY) || DEFAULT_LANG; } catch (e) { return DEFAULT_LANG; }
}

function setLang(lang) {
  try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (e) {}
}

export function injectLangToggle() {
  const existing = document.getElementById('iif-lang-toggle');
  if (existing) return;

  const btn = document.createElement('button');
  btn.id = 'iif-lang-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Toggle language / تبديل اللغة');
  btn.innerHTML = `<span class="iif-lang-toggle__code">${getLang() === 'ar' ? 'EN' : 'AR'}</span>`;

  const style = document.createElement('style');
  style.textContent = `
    #iif-lang-toggle {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1100;
      appearance: none;
      background: rgba(10, 14, 24, 0.8);
      border: 1px solid rgba(201, 162, 39, 0.25);
      color: #c9a227;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 0.4rem 0.8rem;
      border-radius: 10px;
      cursor: pointer;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: background 0.15s ease, border-color 0.15s ease;
    }
    [dir="rtl"] #iif-lang-toggle {
      right: auto;
      left: 1rem;
    }
    #iif-lang-toggle:hover {
      background: rgba(201, 162, 39, 0.15);
      border-color: #c9a227;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    const next = getLang() === 'ar' ? 'en' : 'ar';
    setLang(next);
    window.location.reload();
  });
}
