/**
 * يوسّع government-data.json ليشمل مرجعاً واحداً على الأقل لكل دولة من نطاق «195»
 * (أعضاء الأمم المتحدة + دولة فلسطين بصفة مراقب)، وفق بيانات world-countries.
 * لا يكرّر الدول الموجودة مسبقاً (يطابق حقل country أو أسماءً بديلة).
 *
 * الاستخدام: node financial-consulting/government-search/expand-government-data-to-un195.mjs
 * ثم: npm run build:gov-data
 */
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import countries from 'world-countries';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(__dirname, 'government-data.json');

/** أسماء عربية مستخدمة يدوياً في البيانات الحالية ↔ ISO 3166-1 alpha-2 */
const AR_NAME_TO_ISO2 = {
  السعودية: 'SA',
  'الولايات المتحدة': 'US',
  بريطانيا: 'GB',
  'المملكة المتحدة': 'GB',
  فرنسا: 'FR',
  ألمانيا: 'DE',
  الصين: 'CN',
  اليابان: 'JP',
  الهند: 'IN',
  روسيا: 'RU',
  كندا: 'CA',
  أستراليا: 'AU',
  'كوريا الجنوبية': 'KR',
  إسبانيا: 'ES',
  إيطاليا: 'IT',
  الإمارات: 'AE',
  مصر: 'EG',
};

const UN195 = countries.filter((c) => c.unMember || c.cca2 === 'PS');

function countryArToIso2(nameAr) {
  if (!nameAr) return null;
  if (AR_NAME_TO_ISO2[nameAr]) return AR_NAME_TO_ISO2[nameAr];
  const byExact = countries.find((c) => c.translations.ara.common === nameAr);
  if (byExact) return byExact.cca2;
  const byOfficial = countries.find((c) => c.translations.ara.official === nameAr);
  if (byOfficial) return byOfficial.cca2;
  return null;
}

function buildCoveredIso2(entities) {
  const set = new Set();
  for (const e of entities) {
    const iso = countryArToIso2(e.country);
    if (iso) set.add(iso);
  }
  return set;
}

function makeReferenceEntity(country, id) {
  const nameAr = country.translations.ara.common;
  const capital = country.capital?.[0] ?? '';
  return {
    id,
    title: `بوابة مرجعية — ${nameAr}`,
    description:
      'مرجع استعلامي للدولة في النظام الدولي؛ يُفضّل التحقق من المواقع والجهات الحكومية الرسمية للدولة.',
    type: 'مرجع دولة',
    region: capital || 'العاصمة',
    country: nameAr,
    services: ['دبلوماسية', 'علاقات دولية', 'مرجع', 'استعلام'],
    icon: country.flag,
    /** صيغة البنك الدولي الحالية: رمز ISO2 صغير (مثل is) وليس ISO3 (ISL) — وإلا 404 */
    website: `https://data.worldbank.org/country/${country.cca2.toLowerCase()}`,
    websiteAccessNote:
      'رابط مرجعي (البنك الدولي — ملف الدولة)؛ للتحقق من الوزارات والهيئات الرسمية يُرجى زيارة المواقع الحكومية المعتمدة في الدولة.',
    phone: '',
    address: capital,
    keywords: ['دولة', 'حكومة', 'مرجع', 'خارجية', nameAr],
  };
}

const existing = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const covered = buildCoveredIso2(existing);

let nextId = 50000;
while (existing.some((e) => e.id === nextId)) nextId++;

const added = [];
for (const c of UN195) {
  if (covered.has(c.cca2)) continue;
  const entity = makeReferenceEntity(c, nextId++);
  added.push(entity);
  existing.push(entity);
  covered.add(c.cca2);
}

if (added.length === 0) {
  console.log('Nothing to add — already at', covered.size, 'countries,', existing.length, 'entities.');
  process.exit(0);
}

existing.sort((a, b) => {
  const ca = a.country || '';
  const cb = b.country || '';
  if (ca !== cb) return ca.localeCompare(cb, 'ar');
  return (a.title || '').localeCompare(b.title || '', 'ar');
});

fs.writeFileSync(jsonPath, JSON.stringify(existing, null, 2) + '\n', 'utf8');
console.log(
  'Wrote',
  jsonPath,
  '| total entities:',
  existing.length,
  '| added:',
  added.length,
  '| distinct countries (expected 195):',
  covered.size
);
