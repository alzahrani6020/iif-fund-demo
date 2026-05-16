@echo off
cd /d C:\Users\vip\iif-fund-demo
set BODY="{"site_id":"4d4c58f4-8834-4567-afa9-849abc535ea4"}
call npx netlify-cli api createSiteBuild --data %BODY%