module.exports = {
  launch: {
    headless: "new", // Fixes the deprecation warning
    args: ["--no-sandbox", "--disable-setuid-sandbox"] // Fixes the crash
  }
};