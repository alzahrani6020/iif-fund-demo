/**
 * يتحقق من أن MINIMAX_API_KEY مضبوط (بدون طباعة المفتاح).
 */
import {
  loadDotEnv,
  getMiniMaxApiKey,
  isMiniMaxKeyPlaceholder,
} from './lib/dotenv-load.mjs';

const hasFile = loadDotEnv();
const key = getMiniMaxApiKey();

if (!hasFile) {
  console.log('[minimax] لا يوجد ملف .env — انسخ .env.example إلى .env');
  process.exit(1);
}

if (isMiniMaxKeyPlaceholder(key)) {
  console.log(
    '[minimax] MINIMAX_API_KEY غير مضبوط — افتح .env والصق المفتاح من platform.minimax.io'
  );
  process.exit(1);
}

console.log('[minimax] المفتاح مضبوط (جاهز لـ npm run minimax:ask)');
process.exit(0);
