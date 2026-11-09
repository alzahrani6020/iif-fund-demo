let d = '';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  try {
    const j = JSON.parse(d);
    const list = Array.isArray(j) ? j : [j];
    list.forEach(x => {
      const s = x.service || x;
      console.log([s.id, s.type, s.name, (s.serviceDetails && s.serviceDetails.url) || s.url || ''].join(' | '));
    });
  } catch (e) { console.log('PARSE_FAIL', d.slice(0, 200)); }
});
