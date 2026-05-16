#!/usr/bin/env node
/**
 * جسر MiniMax عبر **MiniMax Platform API** (OpenAI-compatible).
 * الوثائق: https://platform.minimax.io/docs/api-reference/text-openai-api
 *
 * ملاحظة: تطبيق **MiniMax Agent** على سطح المكتب ليس له واجهة برمجية عامة للتحكم به من هنا؛
 * التكامل المؤتمت هنا يمر عبر **مفتاح API** من منصة MiniMax.
 */
import {
  loadDotEnv,
  getMiniMaxApiKey,
  isMiniMaxKeyPlaceholder,
} from './lib/dotenv-load.mjs';

function truncateForLog(s, max = 2000) {
  const t = String(s);
  if (t.length <= max) return t;
  return `${t.slice(0, max)}… [truncated ${t.length - max} chars]`;
}

loadDotEnv();

const apiKey = getMiniMaxApiKey();
const model = process.env.MINIMAX_MODEL || 'MiniMax-M2.7';
const baseUrl = (process.env.MINIMAX_BASE_URL || 'https://api.minimax.io/v1').replace(
  /\/$/,
  ''
);

const rawArgv = process.argv.slice(2);

if (rawArgv[0] === '--help' || rawArgv[0] === '-h') {
  console.log(`MiniMax Platform API (OpenAI-compatible)

Usage:
  npm run minimax:ask -- "your question"
  echo long text | npm run minimax:ask --

Environment (.env in project root):
  MINIMAX_API_KEY   required (from platform.minimax.io)
  MINIMAX_MODEL     optional (default: MiniMax-M2.7)
  MINIMAX_BASE_URL  optional (default: https://api.minimax.io/v1)
`);
  process.exit(0);
}

async function readPrompt() {
  const joined = rawArgv.join(' ').trim();
  if (joined) return joined;
  if (process.stdin.isTTY) return '';
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8').trim();
}

const prompt = await readPrompt();

if (!apiKey || isMiniMaxKeyPlaceholder(apiKey)) {
  console.error(
    'Missing or placeholder MINIMAX_API_KEY. Copy .env.example to .env and set a real key from platform.minimax.io.'
  );
  process.exit(1);
}

if (!prompt) {
  console.error('Usage: npm run minimax:ask -- "your question"   (or pipe text on stdin)');
  process.exit(1);
}

const url = `${baseUrl}/chat/completions`;
const body = {
  model,
  messages: [
    {
      role: 'system',
      content:
        'You are a helpful assistant for a static-site + Node dev-server repo. Be concise. Reply in Arabic when the user writes Arabic.',
    },
    { role: 'user', content: prompt },
  ],
  temperature: 0.7,
};

const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify(body),
});

const raw = await res.text();
let json;
try {
  json = JSON.parse(raw);
} catch {
  if (!res.ok) {
    console.error(`HTTP ${res.status}:`, truncateForLog(raw));
  } else {
    console.error('Non-JSON response:', truncateForLog(raw));
  }
  process.exit(1);
}

if (!res.ok) {
  const msg =
    json.error?.message ||
    json.message ||
    json.base_resp?.status_msg ||
    raw;
  console.error(
    `HTTP ${res.status}:`,
    typeof msg === 'string' ? truncateForLog(msg) : truncateForLog(JSON.stringify(msg))
  );
  process.exit(1);
}

const content = json.choices?.[0]?.message?.content;
if (content == null || content === '') {
  console.error('Unexpected response:', truncateForLog(raw));
  process.exit(1);
}

process.stdout.write(String(content));
if (!String(content).endsWith('\n')) process.stdout.write('\n');
