/**
 * تقرير حجم index.html الرئيسي للواجهة (أسطر + بايت) — للصيانة قبل تقسيم الملف.
 * التشغيل: npm run report:index-size
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const INDEX = path.join(ROOT, 'financial-consulting', 'iif-fund-demo', 'index.html');

const st = fs.statSync(INDEX);
const text = fs.readFileSync(INDEX, 'utf8');
const lines = text.split(/\n/).length;
const kb = (st.size / 1024).toFixed(1);

console.log('index.html (iif-fund-demo)');
console.log('  path:   ', path.relative(ROOT, INDEX));
console.log('  bytes:  ', st.size);
console.log('  KB:     ', kb);
console.log('  lines:  ', lines);
console.log('');
console.log('If lines/KB grow without bound, consider splitting inline sections into partials + lazy JS.');
