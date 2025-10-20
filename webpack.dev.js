const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');


module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: true,        // opens browser automatically
    hot: true,         // enables hot reloading
    watchFiles: ['src/**/*'], // watches all your src files
  },
});