const {spawnSync}=require('node:child_process');
const fs=require('fs');
const j=fs.readFileSync('C:/Users/vip/nt-body.json','utf8').trim();
const r=spawnSync(process.execPath,['C:/Users/vip/AppData/Local/npm-cache/_npx/da5c1b6ea715e8b4/node_modules/netlify-cli/bin/run.js','api','createSiteBuild','--data',j],{stdio:'inherit',cwd:'C:/Users/vip/iif-fund-demo'});
process.exit(r.status===null?1:r.status);