const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

const files = [
  path.resolve(__dirname, "../README.md"),
  path.resolve(__dirname, "../public/appInfo.md"),
];

files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const updated = content.replace(/{{version}}/g, pkg.version);
  fs.writeFileSync(file, updated);
  console.info(`---- ✅ Version ${pkg.version} changed in ${file} correctly.`);
});
