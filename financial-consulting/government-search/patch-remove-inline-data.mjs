/**
 * يزيل المصفوفة المضمّنة ويضيف government-data.js (مرة واحدة أو عند الحاجة)
 */
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, 'SIMPLE-GOVERNMENT-PLATFORM.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const headerNeedle =
  '    <script>\n        // Government Data - 95 Countries Global Coverage\n        const governmentData = ';
if (!html.includes(headerNeedle)) {
  console.log('Already patched or header changed; skip.');
  process.exit(0);
}

const start = html.indexOf(headerNeedle);
const bracketPos = html.indexOf('[', start);
function endOfBalancedArray(source, openIndex) {
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
      if (depth === 0) return j + 1;
    }
  }
  throw new Error('unclosed array literal');
}
const afterBracket = endOfBalancedArray(html, bracketPos);
let rest = html.slice(afterBracket).replace(/^\s*;\s*/, '');
const replacement =
  '    <script src="government-data.js"></script>\n' +
  '    <script>\n' +
  '        let governmentData = window.__GOVERNMENT_DATA__ || [];\n' +
  '\n';
const newHtml = html.slice(0, start) + replacement + rest;
fs.writeFileSync(htmlPath, newHtml, 'utf8');
console.log('Patched', htmlPath);
