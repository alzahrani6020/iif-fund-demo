const {spawnSync}=require('node:child_process');
const fs=require('fs');
const j=fs.readFileSync('C:/Users/vip/nt-body.json','utf8').trim();
const r=spawnSync('C:/Program Files/nodejs/npx.cmd', ['netlify-cli','api','createSiteBuild','--data', j], {stdio:'inherit', cwd:'C:/Users/vip/iif-fund-demo'});
process.exit(r.status===null?1:r.status);