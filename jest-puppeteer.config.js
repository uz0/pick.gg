module.exports = {
  launch: {
    headless: true,
  },
  server: {
    command: `node server/build/main.js --mocked`,
    port: process.env.PORT || 3001,
    launchTimeout: 10000,
    debug: true,
  },
};
