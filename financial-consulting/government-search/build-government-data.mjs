/**
 * يقرأ government-data.json ويولّد government-data.js
 * للاستخدام بعد تعديل JSON يدوياً: npm run build:gov-data
 */
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(__dirname, 'government-data.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const jsPath = join(__dirname, 'government-data.js');
const jsBody =
  '/** مُولَّد من build-government-data.mjs — المصدر: government-data.json */\n' +
  'window.__GOVERNMENT_DATA__ = ' +
  JSON.stringify(data).replace(/</g, '\\u003c') +
  ';\n';
fs.writeFileSync(jsPath, jsBody, 'utf8');
console.log('Wrote', jsPath, 'entities:', data.length);
