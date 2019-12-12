const webpack = require('webpack');

module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = [];
  }

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) || 'development',
      'process.env.MOCK_USER': JSON.stringify(true),
    }),
  );

  return config;
}