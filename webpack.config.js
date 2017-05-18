const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const _import = require('postcss-easy-import');
const short = require('postcss-short');
// const stylelint = require('stylelint');
const assets = require('postcss-assets');
const reporter = require('postcss-reporter');
const cssnext = require('postcss-cssnext');
const doiuse = require('doiuse');
const sprites = require('postcss-sprites');
const updateRule = sprites.updateRule;

const processors = [
  _import({
    glob: true
  }),
  short,
  cssnext({
    features: {
      autoprefixer: {remove: false}
    }
  }),
  assets({
    basePath: 'app/',
    loadPaths: ['assets/images/'],
    relativeTo: 'app'
  }),
  sprites({
    stylesheetPath: 'app/styles/', //出力するcssのパス
    spritePath: 'app/assets/images',   //スプライト画像を出力する先のパス
    basePath: 'app/',  // urlのベースパス
    relativeTo: 'app',
    retina: true,
    // images/spritesのみスプライトの対象とする
    filterBy(image){
      if(/images\/sprites/.test(image.url)){
        return Promise.resolve();
      }
      return Promise.reject();
    },
    groupBy: function(image) {
      if (image.url.indexOf('@2x') === -1) {
        return Promise.resolve('@1x');
      }
      return Promise.resolve('@2x');
    },
    spritesmith: {
      padding: 10
    },
    hooks: {
      // 出力されるスプライト画像ファイル名を変更する sprite@2xだと同じファイルが量産されるので
      onSaveSpritesheet: function(opts, data) {
        if(data.groups[0] === '@1x'){
          // 通常サイズのスプライト
          return path.join(opts.spritePath, '_sprites.png');
        }else{
          // retinaサイズのスプライト
          return path.join(opts.spritePath, '_sprites@2x.png');
        }
      }
    }
  }),
  reporter({ clearMessages: true })
];

module.exports = {
  context: path.resolve(__dirname, './app'),
  entry: {
    app: './scripts/app.js',
  },

  output: {
    path: path.resolve(__dirname, './app/dist'),
    filename: '[name].bundle.js',
    publicPath: '/assets'
  },

  devServer: {
    contentBase: path.resolve(__dirname, './src')
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
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader'
          ]
        })
      }, {
        test: /.(jpg|png|gif)$/,
        loader: 'url-loader?limit=10000'
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: processors
      }
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: false,
      allChunks: true
    }),
  ]
};
