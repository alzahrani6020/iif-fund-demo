/**
 * Copy WOFF2 from @fontsource/* into assets/fonts/ using names expected by css/fonts-hosted.css.
 * Run: npm run fonts:vendor  (also runs on postinstall)
 */
const fs = require('fs');
const path = require('path');

function pkgDir(pkg) {
  return path.dirname(require.resolve(`${pkg}/package.json`));
}

function copyPair(pkg, srcName, destName, outDir) {
  const src = path.join(pkgDir(pkg), 'files', srcName);
  const dest = path.join(outDir, destName);
  if (!fs.existsSync(src)) {
    console.warn('[fonts:vendor] missing source:', src);
    return false;
  }
  fs.copyFileSync(src, dest);
  return true;
}

const root = path.join(__dirname, '..');
const out = path.join(root, 'assets', 'fonts');
fs.mkdirSync(out, { recursive: true });

const plus = '@fontsource/plus-jakarta-sans';
const noto = '@fontsource/noto-sans-arabic';
const weights = [400, 500, 600, 700];

let ok = 0;
let fail = 0;
for (const w of weights) {
  if (copyPair(plus, `plus-jakarta-sans-latin-${w}-normal.woff2`, `plus-jakarta-sans-${w}.woff2`, out)) ok++;
  else fail++;
  /* Arabic script subset; Latin in UI comes from Plus Jakarta via font stack */
  if (copyPair(noto, `noto-sans-arabic-arabic-${w}-normal.woff2`, `noto-sans-arabic-${w}.woff2`, out)) ok++;
  else fail++;
}

console.log(`[fonts:vendor] copied ${ok} files to assets/fonts (${fail} missing)`);
if (fail) process.exitCode = 1;
