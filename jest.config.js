module.exports = {
  preset: 'jest-puppeteer',
  setupTestFrameworkScriptFile: "expect-puppeteer",
  globals: {
    URL: `http://localhost:${process.env.PORT || 3001}`,
  }
};
