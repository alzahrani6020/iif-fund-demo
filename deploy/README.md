# Deploy (Recommended: GitHub Pages + optional VPS)

This project is **static-first**. For best results:

- **GitHub Pages** hosts the UI (static files only).
- **VPS** hosts:
  - **SearXNG** (Docker)
  - **Translator** (optional, self-hosted NLLB/LibreTranslate)

The UI should keep working even if optional backend services are down.

## GitHub Pages

The static UI is deployed via `.github/workflows/github-pages.yml`.

1. Enable Pages in repo settings: **Settings → Pages → Source: GitHub Actions**.
2. Push to `main` — the workflow publishes `financial-consulting/iif-fund-demo/` automatically.
3. Public URL: `https://<user>.github.io/<repo>/`

### Keeping the live site healthy

- **Smoke after deploy (local):**

```bash
# PowerShell
$env:PROXY_BASE="https://<user>.github.io/<repo>"; npm run smoke:live
```

`smoke:live` fails only if the unified search page is broken; translate/SearX issues are **warnings** so a partial outage does not block the check.

**GitHub Actions (manual):** workflow **Smoke live site** — paste your `https://<user>.github.io/<repo>/` URL when prompted; no extra secrets required for that check.

## VPS: SearXNG (Docker)

See:

- SearXNG setup: [`engines/searxng/README.md`](../engines/searxng/README.md)
- VPS deployment: [`engines/searxng/deploy/README-VPS.md`](../engines/searxng/deploy/README-VPS.md)
- Caddy: [`deploy/caddy/Caddyfile.example`](./caddy/Caddyfile.example)
- Nginx: [`deploy/nginx-searx.conf.example`](./nginx-searx.conf.example)

## Optional Vercel proxy

If you need `/api/searx` on a public domain, a Vercel function is available as an optional backend. See [VERCEL-DEPLOY.md](../VERCEL-DEPLOY.md).
