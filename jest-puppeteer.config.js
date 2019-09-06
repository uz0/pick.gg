module.exports = {
  launch: {
    headless: true,
  },
  server: {
    command: `npm start`,
    port: process.env.PORT || 3001,
    launchTimeout: 10000,
    debug: true,
  },
};
