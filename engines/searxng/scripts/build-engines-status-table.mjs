/**
 * يقرأ data/upstream-settings-default.yml ويولّد محركات-الحالة-والاسباب.md
 * التشغيل من مجلد engines/searxng: node scripts/build-engines-status-table.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const ymlPath = path.join(root, 'data', 'upstream-settings-default.yml');
const outPath = path.join(root, 'محركات-الحالة-والاسباب.md');

if (!fs.existsSync(ymlPath)) {
  console.error('Missing:', ymlPath);
  console.error('Copy from container: docker cp iif-searxng-standalone:/usr/local/searxng/searx/settings.yml', ymlPath);
  process.exit(1);
}

const text = fs.readFileSync(ymlPath, 'utf8');
const idx = text.indexOf('\nengines:\n');
if (idx === -1) throw new Error('engines: not found');
const enginesText = text.slice(idx + '\nengines:\n'.length);

const lines = enginesText.split('\n');
const blocks = [];
let pendingComments = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (/^\s*#/.test(line) && !/^\s*#\s*- name:/.test(line)) {
    const c = line.replace(/^\s*#\s?/, '').trim();
    if (c) pendingComments.push(c);
    continue;
  }
  if (/^  - name:\s/.test(line)) {
    const nameM = line.match(/^  - name:\s*(.+)$/);
    const name = nameM ? nameM[1].trim().replace(/^["']|["']$/g, '') : '?';
    const blockLines = [line];
    i++;
    while (i < lines.length && !/^  - name:\s/.test(lines[i])) {
      const l = lines[i];
      if (/^[a-zA-Z_][a-zA-Z0-9_]*:\s*$/.test(l) && !l.startsWith('  ') && !l.startsWith('\t')) {
        i--;
        break;
      }
      blockLines.push(l);
      i++;
    }
    i--;
    blocks.push({
      name,
      comments: [...pendingComments],
      text: blockLines.join('\n'),
    });
    pendingComments = [];
  } else if (line.trim() !== '') {
    pendingComments = [];
  }
}

function parseBlock({ name, comments, text }) {
  const disabled = /^\s*disabled:\s*true\s*$/m.test(text);
  const inactive = /^\s*inactive:\s*true\s*$/m.test(text);
  const emptyApiKey =
    /^\s*api_key:\s*["']?["']?\s*$/m.test(text) || /^\s*api_key:\s*""\s*$/m.test(text);

  let reason = '';
  const docHint = comments.length ? `تعليق في الملف: «${comments.join(' — ')}». ` : '';

  if (inactive) {
    reason =
      docHint +
      'مُعلَم `inactive: true` — غالباً صيانة أو يحتاج إعداداً (مفتاح API، خادم، إلخ).';
  } else if (disabled) {
    reason =
      docHint +
      'مُعلَم `disabled: true` في الإعداد الافتراضي — يمكن تفعيله من Preferences → Engines.';
  } else {
    reason = docHint + 'مفعّل افتراضياً (لا `disabled: true` ولا `inactive: true`).';
  }
  if (emptyApiKey && /api_key/.test(text)) {
    reason += ' يحتوي `api_key` فارغاً.';
  }
  return { name, disabled, inactive, reason, comments };
}

const removedByUs = new Set(['ahmia', 'torch']);
const removedNote =
  '**في مثيلكم:** مُزال عبر `remove` لأن التشغيل فشل في السجلات. **في الملف الافتراضي:** التعليق `# Requires Tor` — يحتاج شبكة Tor؛ بدونها يُعطَّل/يفشل.';

const rows = blocks.map((b) => parseBlock(b));

const active = rows.filter((r) => !r.disabled && !r.inactive);
const disabledOnly = rows.filter((r) => r.disabled && !r.inactive);
const inactiveOnly = rows.filter((r) => r.inactive);

function escCell(s) {
  return String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

let md = `# محركات SearXNG — حالة وأسباب

> **مصدر الأسماء:** \`data/upstream-settings-default.yml\` (نسخة من الإعداد الافتراضي في صورة Docker).  
> **كيف يُحدَّث الجدول:** انسخ الملف من الحاوية ثم \`node engines/searxng/scripts/build-engines-status-table.mjs\`  
> **تنبيه:** SearXNG لا يكتب فقرة «لماذا» لكل محرك؛ العمود **«التفسير»** يجمع **التعليقات الموجودة في YAML** مع **الحقول** (\`disabled\` / \`inactive\` / \`api_key\`).

## ملخص أرقام

| البند | العدد |
|--------|------:|
| إجمالي تعريفات المحركات | ${rows.length} |
| مفعّلة افتراضياً | ${active.length} |
| \`disabled: true\` | ${disabledOnly.length} |
| \`inactive: true\` | ${inactiveOnly.length} |

---

## أ) محركات أزلتموها من المثيل (\`settings.yml\`)

| الاسم | السبب في الملف الافتراضي | سبب الإزالة عندكم |
|-------|---------------------------|-------------------|
| **ahmia** | تعليق \`# Requires Tor\` — محرك شبكة البصل | ${removedNote} |
| **torch** | تعليق \`# Requires Tor\` + URL \`.onion\` | ${removedNote} |

---

## ب) جدول جميع المحركات

| اسم المحرك | الحالة في الافتراضي | التفسير |
|-------------|---------------------|---------|
`;

for (const r of rows.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
  let status = 'مفعّل';
  if (r.inactive) status = '`inactive: true`';
  else if (r.disabled) status = '`disabled: true`';
  let note = r.reason;
  if (removedByUs.has(r.name)) {
    note =
      'تعليق الملف: `# Requires Tor`. ' +
      removedNote;
  }
  md += `| ${escCell(r.name)} | ${escCell(status)} | ${escCell(note)} |\n`;
}

md += `\n---\n\n*توليد:* \`node scripts/build-engines-status-table.mjs\` (من مجلد \`engines/searxng\`)\n`;

fs.writeFileSync(outPath, md, 'utf8');
console.log('Wrote', outPath, 'engines:', rows.length);
