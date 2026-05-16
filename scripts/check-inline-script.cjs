const fs = require('fs');

const htmlPath = 'financial-consulting/iif-fund-demo/index.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const marker = '<script nonce="iif2026">';
const i = html.indexOf(marker);
if (i < 0) {
  console.error('NO_MARKER', marker);
  process.exit(1);
}
const j = html.indexOf('</script>', i);
if (j < 0) {
  console.error('NO_END_SCRIPT_TAG');
  process.exit(1);
}
const js = html.slice(i + marker.length, j);
console.log('inline_script_chars', js.length);
try {
  const vm = require('vm');
  new vm.Script(js, { filename: 'iif-inline-script.js' });
  console.log('INLINE_SCRIPT_OK');
} catch (e) {
  console.error('INLINE_SCRIPT_SYNTAX_ERROR');
  console.error(e && e.message ? e.message : String(e));
  if (e && e.stack) {
    console.error('STACK_HEAD');
    console.error(String(e.stack).split('\n').slice(0, 5).join('\n'));
  }
  process.exit(2);
}

