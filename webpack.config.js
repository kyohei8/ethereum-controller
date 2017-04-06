const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, './renderer'),
  entry: {
    app: './app.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['stage-0', 'react', 'es2015'] }
        }],
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    publicPath: '/assets'
  },
  devServer: {
    contentBase: path.resolve(__dirname, './src')
  }
};
