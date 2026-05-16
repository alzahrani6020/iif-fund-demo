# مؤشر بيئة التطوير

- **`START-IIF-FULL.bat`** (جذر المشروع) — ويندوز: Docker + `npm start` + فتح المنصة الحكومية.
- **`README.md`** — تشغيل الواجهات (`npm start`) + المحرك المنفصل (`engines/searxng/`).
- **`engines/searxng/README.md`** — SearXNG كمشروع مستقل (Docker، المضيف **18080**).

## بيئة عامة (Docker + أدوات)

- Docker Desktop يجب أن يكون شغّالاً لتشغيل **SearXNG** من `engines/searxng/`.
- **Node.js 22** (انظر `.nvmrc` / `.node-version`) — نفس خط الإصدار في **GitHub Actions** و**Netlify**؛ `engines` في `package.json` يطلب `>=22`.

## عناوين سريعة

- خادم IIF: **http://127.0.0.1:3333/**
- SearXNG (إن شغّلت المشروع المنفصل): **http://127.0.0.1:18080/**
