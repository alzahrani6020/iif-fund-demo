# تفعيل GitHub Pages بنوع GitHub Actions (مرة واحدة لكل مستودع).
# يتطلب: GitHub CLI مثبتاً ومسجلاً (gh auth login).
# الاستخدام: .\scripts\enable-github-pages.ps1
# أو: .\scripts\enable-github-pages.ps1 owner/repo

param(
  [string] $Repo = "alzahrani6020/iif-web"
)

$ErrorActionPreference = "Stop"
gh api -X POST "repos/$Repo/pages" -f build_type=workflow
Write-Host "OK: Pages enabled (workflow). URL: https://github.com/$Repo/settings/pages"
