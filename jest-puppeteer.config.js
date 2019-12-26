module.exports = {
  launch: {
    headless: true,
  },
  exitOnPageError: false,
  server: {
    command: `node server/build/main.js --mocked`,
    port: process.env.PORT || 3001,
    launchTimeout: 10000,
    debug: true,
  },
};
