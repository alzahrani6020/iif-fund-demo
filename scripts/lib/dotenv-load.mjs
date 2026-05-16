/**
 * تحميل `.env` من جذر المشروع (لا يستبدل متغيرات البيئة الموجودة مسبقاً).
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export function loadDotEnv(cwd = process.cwd()) {
  const envPath = resolve(cwd, '.env');
  if (!existsSync(envPath)) return false;
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
  return true;
}

/** مفتاح MiniMax فقط — لا نستخدم OPENAI_API_KEY حتى لا يُستبدل مفتاح فارغ في .env بمفتاح آخر من النظام بالخطأ. */
export function getMiniMaxApiKey() {
  return String(process.env.MINIMAX_API_KEY || '').trim();
}

/** مفتاح غير جاهز للاستخدام (فارغ أو placeholder) */
export function isMiniMaxKeyPlaceholder(key) {
  const t = String(key).trim();
  if (!t) return true;
  if (t === 'PASTE_YOUR_KEY_HERE') return true;
  if (t.startsWith('PASTE_')) return true;
  return false;
}
