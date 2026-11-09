let d = '';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  try {
    const j = JSON.parse(d);
    if (!Array.isArray(j) || !j.length) { console.log('no deploys'); return; }
    j.slice(0, 3).forEach(x => {
      const dep = x.deploy || x;
      console.log('deploy:', dep.status, dep.createdAt, dep.finishedAt || '', (dep.errorMessage || '').slice(0, 200));
    });
  } catch (e) { console.log('PARSE_FAIL', d.slice(0, 200)); }
});
