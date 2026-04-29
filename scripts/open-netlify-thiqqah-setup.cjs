/**
 * يفتح لوحة Netlify لاستيراد مشروع ثقة (خطوة واحدة من المتصفح).
 * الاستخدام: npm run netlify:thiqqah:setup
 * ويندوز: RUN-NETLIFY-THIQQAH-STANDALONE.cmd
 */
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const startUrl = "https://app.netlify.com/start";
const teamProjects = "https://app.netlify.com/teams/dr-talal/projects";
const docPath = path.join(__dirname, "..", "NETLIFY-THIQQAH-STANDALONE.md");

function main() {
  console.log("Thiqqah standalone Netlify — open these in the browser:\n");
  console.log("  1) Import project:", startUrl);
  console.log("  2) Optional team list:", teamProjects);
  console.log("\nThen set: Base directory = thiqqah-site , Publish directory = .\n");
  if (fs.existsSync(docPath)) {
    console.log("Full steps:", docPath);
  }

  if (process.platform === "win32") {
    exec(`start "" "${startUrl}"`);
    exec(`start "" "${teamProjects}"`);
  } else if (process.platform === "darwin") {
    exec(`open "${startUrl}"`);
    exec(`open "${teamProjects}"`);
  } else {
    exec(`xdg-open "${startUrl}" || true`);
  }
}

main();
