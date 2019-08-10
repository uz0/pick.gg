var path = require('path')
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './app.js',
  target: 'node',
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  }
};