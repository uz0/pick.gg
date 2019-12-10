const webpack = require('webpack');

module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = [];
  }

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.MOCK_USER': JSON.stringify(true),
    }),
  );

  return config;
}