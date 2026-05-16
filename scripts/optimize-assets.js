/**
 * Recompress emblem (JPEG + WebP) and optional PNG→WebP under assets/.
 * Run: npm run assets:optimize
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assets = path.join(__dirname, '..', 'assets');

async function emblem() {
  const jpgPath = path.join(assets, 'emblem.jpg');
  if (!fs.existsSync(jpgPath)) {
    console.warn('[assets:optimize] skip emblem — emblem.jpg missing');
    return;
  }
  const input = fs.readFileSync(jpgPath);
  const meta = await sharp(input).metadata();
  console.log('[assets:optimize] emblem (in)', meta.width + '×' + meta.height, Math.round(input.length / 1024) + ' KB');

  const tmpJpg = path.join(assets, 'emblem.__tmp__.jpg');
  await sharp(input)
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(tmpJpg);
  fs.renameSync(tmpJpg, jpgPath);

  await sharp(fs.readFileSync(jpgPath))
    .webp({ quality: 80, effort: 6, smartSubsample: true })
    .toFile(path.join(assets, 'emblem.webp'));

  const jpgKb = Math.round(fs.statSync(jpgPath).size / 1024);
  const webpKb = Math.round(fs.statSync(path.join(assets, 'emblem.webp')).size / 1024);
  console.log('[assets:optimize] emblem.jpg →', jpgKb, 'KB | emblem.webp →', webpKb, 'KB');
}

async function optionalPng(name) {
  const pngPath = path.join(assets, `${name}.png`);
  if (!fs.existsSync(pngPath)) return;
  await sharp(pngPath).webp({ quality: 82, effort: 5 }).toFile(path.join(assets, `${name}.webp`));
  const w = Math.round(fs.statSync(path.join(assets, `${name}.webp`)).size / 1024);
  console.log('[assets:optimize]', name + '.webp →', w, 'KB');
}

async function main() {
  await emblem();
  await optionalPng('dr-talal-al-zahrani');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
