const CACHE = {};

export async function loadLang(lang) {
  if (CACHE[lang]) return CACHE[lang];
  try {
    const res = await fetch(`src/i18n/${lang}.json`);
    const data = await res.json();
    CACHE[lang] = data;
    return data;
  } catch (e) {
    console.warn('i18n load failed for', lang, e);
    return {};
  }
}

export function t(key, data = {}) {
  // Placeholder: will use loaded translations
  return data[key] || key;
}
