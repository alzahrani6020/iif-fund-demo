import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, 'SIMPLE-GOVERNMENT-PLATFORM.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const marker = 'const governmentData = ';
const start = html.indexOf(marker);
if (start < 0) {
  console.log('لا توجد مصفوفة مضمّنة في HTML — المصدر الحالي: government-data.json ثم npm run build:gov-data');
  process.exit(0);
}
let i = start + marker.length;
while (html[i] && /\s/.test(html[i])) i++;
const bracketStart = i;
if (html[bracketStart] !== '[') throw new Error('expected [');

function extractBalancedArray(source, openIndex) {
  let depth = 0;
  let inString = false;
  let stringChar = null;
  let escape = false;
  for (let j = openIndex; j < source.length; j++) {
    const c = source[j];
    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (c === '\\') {
        escape = true;
        continue;
      }
      if (c === stringChar) {
        inString = false;
        stringChar = null;
      }
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      inString = true;
      stringChar = c;
      continue;
    }
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) return source.slice(openIndex, j + 1);
    }
  }
  throw new Error('unclosed array literal');
}

let arrStr = extractBalancedArray(html, bracketStart);
// إزالة تعليقات // فقط عند بداية السطر (لا تمس https://)
arrStr = arrStr
  .split(/\r?\n/)
  .map((line) => {
    const t = line.trim();
    if (t.startsWith('//')) return '';
    return line;
  })
  .join('\n');
const data = (0, eval)('(' + arrStr + ')');
const outPath = join(__dirname, 'government-data.json');
fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
const jsPath = join(__dirname, 'government-data.js');
const jsBody =
  '/** تُولَّد من extract-data.mjs — للتحديث: عدّل government-data.json ثم npm run build:gov-data */\n' +
  'window.__GOVERNMENT_DATA__ = ' +
  JSON.stringify(data).replace(/</g, '\\u003c') +
  ';\n';
fs.writeFileSync(jsPath, jsBody, 'utf8');
console.log('Wrote', outPath, 'and', jsPath, 'entities:', data.length);
