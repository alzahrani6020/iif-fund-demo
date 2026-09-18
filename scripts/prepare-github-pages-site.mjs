import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "gh-pages-dist");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function copyFileIfExists(src, dst) {
  if (!(await exists(src))) return;
  await ensureDir(path.dirname(dst));
  await fs.copyFile(src, dst);
}

async function copyDirFiltered(src, dst, options = {}) {
  if (!(await exists(src))) return;

  const {
    skipDirs = new Set(),
    skipFiles = new Set(),
    skipExts = new Set()
  } = options;

  await ensureDir(dst);

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);

    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      await copyDirFiltered(srcPath, dstPath, options);
      continue;
    }

    if (skipFiles.has(entry.name)) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (skipExts.has(ext)) continue;

    await copyFileIfExists(srcPath, dstPath);
  }
}

await fs.rm(OUT, { recursive: true, force: true });
await ensureDir(OUT);

/* =========================================================
   ROOT PUBLIC FILES
   ========================================================= */

const rootFiles = [
  "index.html",
  "404.html",
  "gateway.css",
  "executive-brief.html",
  "sovereign-standards.html",
  "robots.txt",
  "sitemap.xml",
  "_headers",
  "_redirects"
];

for (const file of rootFiles) {
  await copyFileIfExists(
    path.join(ROOT, file),
    path.join(OUT, file)
  );
}

/* =========================================================
   ROOT ASSETS
   ========================================================= */

await copyDirFiltered(
  path.join(ROOT, "assets"),
  path.join(OUT, "assets"),
  {
    skipDirs: new Set(["cache", ".next", "node_modules"]),
    skipFiles: new Set([".env", ".env.local"]),
    skipExts: new Set([".pack"])
  }
);

/* =========================================================
   LEGAL PUBLIC PAGES
   ========================================================= */

await copyDirFiltered(
  path.join(ROOT, "legal"),
  path.join(OUT, "legal"),
  {
    skipDirs: new Set(["node_modules", ".next"]),
    skipFiles: new Set(["package.json", "package-lock.json"]),
    skipExts: new Set([
      ".md", ".ps1", ".bat", ".cmd",
      ".mjs", ".cjs", ".ts", ".tsx",
      ".jsx", ".sql", ".map", ".lock"
    ])
  }
);

/* =========================================================
   MAIN IIF SITE
   ========================================================= */

const SITE_SRC = path.join(
  ROOT,
  "financial-consulting",
  "iif-fund-demo"
);

const SITE_OUT = path.join(
  OUT,
  "financial-consulting",
  "iif-fund-demo"
);

await ensureDir(SITE_OUT);

const siteDirs = [
  "assets",
  "components",
  "config",
  "css",
  "data",
  "js",
  "lib",
  "services",
  "src",
  "styles",
  "admin-dashboard"
];

const siteSkipDirs = new Set([
  "archive",
  "e2e",
  "githooks",
  "ops",
  "reports",
  "scripts",
  "node_modules",
  ".next"
]);

const siteSkipFiles = new Set([
  ".env",
  ".env.local",
  ".env.example",
  "package.json",
  "package-lock.json",
  "playwright.config.cjs",
  "backend-server.js",
  "server.js",
  "simple-server.js",
  "emit-service-packs.cjs"
]);

const siteSkipExts = new Set([
  ".md",
  ".ps1",
  ".bat",
  ".cmd",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".jsx",
  ".sql",
  ".map",
  ".lock",
  ".pack"
]);

for (const dir of siteDirs) {
  await copyDirFiltered(
    path.join(SITE_SRC, dir),
    path.join(SITE_OUT, dir),
    {
      skipDirs: siteSkipDirs,
      skipFiles: siteSkipFiles,
      skipExts: siteSkipExts
    }
  );
}

const siteFiles = [
  "404.html",
  "about-institution.html",
  "about.html",
  "admin.html",
  "analysis.html",
  "apply.html",
  "careers.html",
  "CNAME",
  "connect.html",
  "contact.html",
  "data-manager.js",
  "diagnostics.html",
  "faq.html",
  "health.html",
  "i18n-inline-en.json",
  "i18n-service-packs-a.js",
  "i18n-service-packs-all.js",
  "i18n-service-packs-b.js",
  "i18n-service-packs-c.js",
  "i18n-service-packs-d.js",
  "i18n.js",
  "iif-machine-translate.js",
  "index.html",
  "letterhead.html",
  "news-sources.html",
  "partnerships.html",
  "portfolio.html",
  "press.html",
  "privacy.html",
  "reports.html",
  "robots.txt",
  "script-backend.js",
  "script-premium.js",
  "script.js",
  "search.html",
  "services.html",
  "sitemap.xml",
  "start-here.html",
  "strategy.html",
  "styles.css",
  "terms.html",
  "transparency.html",
  "web-search.html",
  "_headers",
  "_redirects"
];

for (const file of siteFiles) {
  await copyFileIfExists(
    path.join(SITE_SRC, file),
    path.join(SITE_OUT, file)
  );
}

/* =========================================================
   GOVERNMENT SEARCH
   ========================================================= */

await copyDirFiltered(
  path.join(ROOT, "financial-consulting", "government-search"),
  path.join(OUT, "financial-consulting", "government-search"),
  {
    skipDirs: new Set([
      "node_modules",
      ".next",
      "cache",
      "scripts"
    ]),
    skipFiles: new Set([
      "package.json",
      "package-lock.json",
      ".env",
      ".env.local",
      ".env.example"
    ]),
    skipExts: new Set([
      ".md",
      ".mjs",
      ".cjs",
      ".ts",
      ".tsx",
      ".jsx",
      ".ps1",
      ".bat",
      ".cmd",
      ".sql",
      ".map",
      ".lock",
      ".pack"
    ])
  }
);

/* =========================================================
   FUND-SITE GATEWAY
   ========================================================= */

await copyDirFiltered(
  path.join(ROOT, "financial-consulting", "fund-site"),
  path.join(OUT, "financial-consulting", "fund-site"),
  {
    skipDirs: new Set([
      "node_modules",
      ".next",
      "cache"
    ]),
    skipFiles: new Set([
      "package.json",
      "package-lock.json",
      ".env",
      ".env.local"
    ]),
    skipExts: new Set([
      ".md",
      ".mjs",
      ".cjs",
      ".ts",
      ".tsx",
      ".jsx",
      ".ps1",
      ".bat",
      ".cmd",
      ".sql",
      ".map",
      ".lock",
      ".pack"
    ])
  }
);

/* =========================================================
   NO THIQQAH SOURCE DEPLOYMENT HERE
   Thiqqah is published separately on thiqqah.live
   ========================================================= */

await fs.writeFile(
  path.join(OUT, ".nojekyll"),
  "",
  "utf8"
);

console.log("prepare-github-pages-site: wrote public allowlist to", OUT);