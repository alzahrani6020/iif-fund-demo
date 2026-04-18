# Deploy (Recommended: Netlify + VPS)

This project is **static-first**. For best results:

- **Netlify** hosts the UI (static files + lightweight Netlify Functions).
- **VPS** hosts:
  - **SearXNG** (Docker)
  - **Translator** (NLLB-200 service)

The UI should keep working even if Translator is down (fallback: no translation).

## Netlify: required environment variables

Set these in Netlify **Site settings → Environment variables**:

- `SEARXNG_URL` = your hosted SearXNG base URL  
  Example: `https://searx.example.com`
- `IIF_TRANSLATE_URL` = your hosted translator base URL  
  Example: `https://translator.example.com`

Optional:

- `IIF_SEARX_TIMEOUT_MS` (default 15000)
- `IIF_TRANSLATE_TIMEOUT_MS` (default 180000)
- `IIF_TRANSLATE_LIBRE_URL` / `IIF_TRANSLATE_LIBRE_API_KEY` — only used when `IIF_TRANSLATE_URL` is **unset** (LibreTranslate fallback in `netlify/functions/translate.js`)

### Keeping the live site healthy (no code deploy required)

- **DNS / TLS:** Custom domains must point at Netlify and finish HTTPS provisioning; mixed DNS breaks only that hostname, not the whole Netlify project.
- **Backup env vars:** Export a private copy of Site → Environment variables (names + values) whenever you change production; see [`deploy/netlify.environment.example`](./netlify.environment.example) as a checklist of names.
- **Smoke after deploy (local):**

```bash
# PowerShell
$env:PROXY_BASE="https://YOUR_SITE.netlify.app"; npm run smoke:live
$env:PROXY_BASE="https://YOUR_SITE.netlify.app"; npm run verify:proxy
```

`smoke:live` fails only if the unified search page or SearX proxy is broken; translate issues are **warnings** so a partial outage does not block the check.

**GitHub Actions (manual):** workflow **Smoke live site** — paste your `https://….netlify.app` URL when prompted; no extra secrets required for that check.

### Sync Netlify site env vars (SearXNG + optional translator API)

From a trusted machine (never commit tokens), with a Netlify personal access token that can manage the site:

```powershell
$env:NETLIFY_AUTH_TOKEN="YOUR_PAT"
$env:NETLIFY_SITE_ID="YOUR_SITE_UUID"
# optional: $env:IIF_TRANSLATE_URL_VALUE="https://your-translator.example.com"
npm run netlify:env:sync
```

This upserts **`SEARXNG_URL`** (defaults to `https://searx.tiekoetter.com`) and **`IIF_TRANSLATE_URL`** only if `IIF_TRANSLATE_URL_VALUE` is set. Use `$env:IIF_NETLIFY_ENV_DRY="1"` first to print the plan without changes. Netlify usually needs a **new deploy** for Functions to read new values (`IIF_NETLIFY_TRIGGER_BUILD=1` triggers one).

## VPS: SearXNG (Docker)

Use the existing compose:

- Folder: `engines/searxng/`
- Command:

```bash
docker compose up -d
```

Then put a reverse proxy (Nginx/Caddy) in front and serve it via HTTPS.

**Examples in this repo:**

- Caddy: [`deploy/caddy/Caddyfile.example`](./caddy/Caddyfile.example)
- Nginx: [`deploy/nginx-searx.conf.example`](./nginx-searx.conf.example)
- Netlify env names (copy into UI): [`deploy/netlify.environment.example`](./netlify.environment.example)

After Netlify is configured, verify from your PC (PowerShell):

```bash
$env:PROXY_BASE="https://YOUR_SITE.netlify.app"; npm run verify:proxy
```

To probe SearXNG directly (local Docker or your HTTPS URL):

```bash
npm run verify:searx
# or
$env:SEARXNG_URL="https://search.example.com"; npm run verify:searx
```

## VPS: Translator (Docker)

See: `deploy/translator/`

```bash
cd deploy/translator
docker compose up -d
```

Expose it via HTTPS as `https://translator.example.com`.

