# AFAQ Project Operating Guide

ROOT = afaq-creative
WEB = app/
PAGES = pages/
COMPONENTS = components/
LIB = lib/
KERNEL = kernel/
PRISMA = prisma/
PUBLIC = public/

RUNTIME = afaq_agent_runtime/
AIC = platform/aic/afaq_intelligence_core/
BRIDGE = platform/aic/aic_bridge.py
RUNTIME_DATA = var/

## Rules

1. Treat `afaq-creative` as the only project root.
2. Never operate outside this root unless explicitly authorized.
3. Do not treat generated artifacts as source code.
4. Ignore build/cache artifacts such as:
   - dist/
   - .next/
   - tsconfig.tsbuildinfo
5. Do not bypass `afaq_agent_runtime` governance.
6. All write or privileged actions must follow the governed approval path.
7. Keep AIC core code under `platform/aic/`.
8. Keep runtime/governance code under `afaq_agent_runtime/`.
9. Keep documentation and reports under `docs/`.
10. Use relative project paths; do not hard-code machine-specific paths.
11. Runtime default port: 8787.
12. Web default port: 3008.
13. Before starting a service on an occupied port, verify the existing service identity.
14. Do not kill processes solely because they occupy 8787 or 3008.
15. Preserve project naming as `afaq-creative`.

## Integration Contract

Web:
Next.js under `app/` / `pages/`

AIC Gateway:
`app/api/admin/aic/`

Bridge:
`platform/aic/aic_bridge.py`

Governed Runtime:
`afaq_agent_runtime/`

Intelligence Core:
`platform/aic/afaq_intelligence_core/`

Unified start:
`scripts/start-afaq.ps1` when present.
