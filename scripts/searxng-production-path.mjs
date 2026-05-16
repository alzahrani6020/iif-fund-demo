#!/usr/bin/env node
/**
 * يطبع مسار الإنتاج الكامل: VPS + DNS + Netlify — بدون أسرار.
 * اختياري (لطباعة سجل DNS جاهز):
 *   SEARXNG_PUBLIC_HOST=search.example.com SERVER_IPV4=203.0.113.10 node scripts/searxng-production-path.mjs
 */
const host = String(process.env.SEARXNG_PUBLIC_HOST || "").trim();
const ip = String(process.env.SERVER_IPV4 || "").trim();

function line(s) {
  process.stdout.write(s + "\n");
}

line("");
line("=== مسار إنتاج SearXNG وربطه بموقع Netlify ===");
line("");
line("1) نطاق وDNS");
line("   - اشترِ نطاقاً أو استخدم نطاقاً فرعياً (مثل search.yourdomain.com).");
line("   - في لوحة DNS عند المسجّل أنشئ سجل A:");
line("       الاسم/Host: النطاق أو @ أو search (حسب المزوّد)");
line("       القيمة: عنوان IPv4 لخادم الـ VPS (ثابت إن أمكن).");
if (host && ip && /^[\d.]+$/.test(ip)) {
  line("");
  line("   — مثال لقيمك الحالية (راجع واجهة المسجّل):");
  line(`       Host: ${host}  →  A  →  ${ip}`);
}
line("");
line("2) VPS (Ubuntu + Docker)");
line("   - افتح المنافذ 80 و 443 (ufw allow 80,443/tcp).");
line("   - من المستودع: engines/searxng/deploy/README-VPS.md");
line("   - نسخ env:  cd engines/searxng/deploy && cp env.example .env");
line("   - في .env:  SEARXNG_HOST=نطاقك-بدون-https");
line("   - في engines/searxng/config/settings.yml: server.base_url: https://نطاقك/ (بشرطة مائلة أخيرة)");
line("   - تشغيل:    bash deploy/scripts/install-docker-ubuntu.sh   ثم   bash deploy/scripts/up-https.sh");
line("");
line("3) تحقق يدوي");
line("   - افتح: https://نطاقك/search?q=test&format=json");
line("   - يجب أن ترى JSON (وليس 403/HTML فقط).");
line("");
line("4) Netlify — متغير بيئة الدوال (Functions)");
line("   - Site settings → Environment variables → Add variable");
line("   - المفتاح: SEARXNG_URL");
line("   - القيمة: https://نطاقك   (بدون /search في النهاية)");
line("   - النطاق: يشمل Functions (ويفضّل Builds أيضاً).");
line("");
line("   أو من الطرفية (رمز PAT + Site ID):");
line('   $env:NETLIFY_AUTH_TOKEN="nfp_..."; $env:NETLIFY_SITE_ID="..."; $env:SEARXNG_URL_VALUE="https://نطاقك"; node scripts/netlify-upsert-site-env.mjs');
line("");
line("5) نشر الواجهة");
line("   - npm run netlify:build:trigger");
line("   - أو اربط GitHub بالموقع ليبني تلقائياً بعد كل push.");
line("");
line("6) GitHub Actions (اختياري)");
line("   - .github/workflows/deploy-searxng-vps.yml — أضف الأسرار ثم Run workflow.");
line("");
if (!host || !ip) {
  line("— لتوليد سطر DNS أعلاه: عيّن SEARXNG_PUBLIC_HOST و SERVER_IPV4 ثم أعد تشغيل هذا السكربت.");
}
line("");
