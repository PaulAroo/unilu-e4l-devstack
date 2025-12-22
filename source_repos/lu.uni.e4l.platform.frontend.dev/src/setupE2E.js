jest.setTimeout(30000); // 30 seconds timeout

// Silence unhandled rejections (common in older Puppeteer teardown)
process.on('unhandledRejection', (reason, p) => {
  // We swallow the error here to keep the console clean
});