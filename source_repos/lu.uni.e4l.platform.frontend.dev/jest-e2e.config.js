module.exports = {
  preset: "jest-puppeteer",
  testRegex: "src/e2e/.*\\.test\\.js$",
  setupTestFrameworkScriptFile: "./src/setupE2E.js"
};
