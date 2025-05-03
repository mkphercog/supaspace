const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

const files = [
  path.resolve(__dirname, "../README.md"),
  path.resolve(__dirname, "../src/pages/AppInfoPage/content/appInfo.md"),
];

files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  let updated = "";

  if (file.includes("README")) {
    updated = content
      .replace(/{{version}}/g, pkg.version)
      .replace(/\/icons/g, "./public/icons");
  } else {
    updated = content.replace(/{{version}}/g, pkg.version);
  }

  fs.writeFileSync(file, updated);
  console.info(`---- ✅ ${pkg.version} - ${file} - updated correctly.`);
});
