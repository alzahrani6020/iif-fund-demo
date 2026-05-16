/**
 * يصلح روابط data.worldbank.org/country/* بعد تغيير الموقع:
 * الصيغة القديمة (رمز ISO ثلاثي حرفي مثل ISL) تعيد 404؛ الصيغة الحالية: رمز ISO ثنائي صغير (مثل is).
 *
 * الاستخدام: node financial-consulting/government-search/fix-worldbank-country-urls.mjs
 */
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import countries from 'world-countries';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(__dirname, 'government-data.json');

const WB_RE = /^https:\/\/data\.worldbank\.org\/country\/([A-Za-z]{3})$/i;

const byIso3 = new Map(countries.map((c) => [c.cca3, c]));

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
let fixed = 0;
for (const e of data) {
  const w = e.website;
  if (!w || typeof w !== 'string') continue;
  const m = w.trim().match(WB_RE);
  if (!m) continue;
  const iso3 = m[1].toUpperCase();
  const country = byIso3.get(iso3);
  if (!country) {
    console.warn('Unknown ISO3 in URL, skip:', w);
    continue;
  }
  const next = `https://data.worldbank.org/country/${country.cca2.toLowerCase()}`;
  if (next !== e.website) {
    e.website = next;
    fixed++;
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Wrote', jsonPath, '| World Bank URLs fixed:', fixed);
