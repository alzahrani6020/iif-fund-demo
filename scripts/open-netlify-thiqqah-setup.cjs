/**
 * يفتح لوحة Netlify لاستيراد مشروع ثقة (خطوة واحدة من المتصفح).
 * الاستخدام: npm run netlify:thiqqah:setup
 * ويندوز: RUN-NETLIFY-THIQQAH-STANDALONE.cmd
 */
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

/** Pre-fills monorepo base so / serves thiqqah-site (see NETLIFY-THIQQAH-STANDALONE.md). */
const deployUrl =
  "https://app.netlify.com/start/deploy?repository=https://github.com/alzahrani6020/iif-web&base=thiqqah-site";
const teamProjects = "https://app.netlify.com/teams/dr-talal/projects";
const docPath = path.join(__dirname, "..", "NETLIFY-THIQQAH-STANDALONE.md");

function main() {
  console.log("Thiqqah standalone Netlify — open these in the browser:\n");
  console.log("  1) Deploy with base=thiqqah-site:", deployUrl);
  console.log("  2) Optional team list:", teamProjects);
  console.log("\nConfirm Publish directory = . (from thiqqah-site/netlify.toml).\n");
  if (fs.existsSync(docPath)) {
    console.log("Full steps:", docPath);
  }

  if (process.platform === "win32") {
    exec(`start "" "${deployUrl}"`);
    exec(`start "" "${teamProjects}"`);
  } else if (process.platform === "darwin") {
    exec(`open "${deployUrl}"`);
    exec(`open "${teamProjects}"`);
  } else {
    exec(`xdg-open "${deployUrl}" || true`);
  }
}

main();
