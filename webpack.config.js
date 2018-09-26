
const path = require('path');
const htmlPlugin = require('html-webpack-plugin');
const friendlyErrorPlugin = require("friendly-errors-webpack-plugin");
const chalk = require("chalk");
const webpack = require('webpack');
const errorOverlayWebpackPlugin = require("error-overlay-webpack-plugin");
const webpackbar = require("webpackbar");
const eslintFrienylyFormate = require("eslint-friendly-formatter");
const loader = require("./loader.js");
let resolve = (url) => path.resolve(__dirname, url)
let cssLoader = ['css', 'styl'].map(item => {
  return {
    test: new RegExp(`\.${item}$`),
    use: loader.createCssLoader(item, {})
  };
});
module.exports = {
  context: resolve('./'),
  mode: 'development',
  cache: true,
  entry: {
    index: resolve('./test/index.js')
  },
  output: {
    path: resolve('./server'),
    filename: '[name][hash:6].js',
    chunkFilename: '[nams].async.[hash:6].js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(vue|js)$/,
        loader: [
          'cache-loader',
          {
            loader: 'eslint-loader',
            options: {
              formatter: eslintFrienylyFormate
            }
          }
        ],
        include: [resolve('./src/'), resolve('./test/')]
      },
      {
        test: /\.vue$/,
        loader: [
          'cache-loader',
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                css: loader.createCssLoader('css'),
                stylus: loader.createCssLoader('stylus'),
                styl: loader.createCssLoader('styl')
              },
              cssSourceMap: true,
              transformToRequire: {
                video: ['src', 'poster'],
                source: 'src',
                img: 'src',
                image: 'xlink:href'
              }
            }
          },
        ],
        include: [resolve('./src/'), resolve('./test/')]
      },
      {
        test: /\.js$/,
        loader: [
          'cache-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ],
       include: [resolve('./src'), resolve('./test')]
      },
      {
        test: /\.(png|gif|jpg|jpeg|webp|svg)$/,
        loader: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 / 2,
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      ...cssLoader
    ]
  },
  plugins: [
    new htmlPlugin({
      chunksSortMode: 'none',
      template: resolve('./test/test.html'),
      filename: 'test.html',
      inject: true
    }),
    new friendlyErrorPlugin({
      compilationSuccessInfo: {
        messages: [`You application is running here http://0.0.0.0:9909`]
      },
      onErrors: function (severity, errors) {
        let [ error ] = (errors || []);
        if (severity === 'error') {
          console.log(chalk.red(`${error.name}:at${error.file}`));;
        } else {
          console.log(chalk.yellow(`${error.name}:at${error.file}`));;
        }
      },
      clearConsole: true,
      additionalFormatters: [],
      additionalTransformers: []
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new errorOverlayWebpackPlugin(),
    new webpackbar()
  ],
  devServer: {
    host: '0.0.0.0',
    port: 9909,
    hot: true,
    overlay: {
      warnings: true,
      errors: true
    },
    contentBase: resolve('../server'),
    quiet: true
  },
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve("./src"),
      'vue': 'vue/dist/vue.esm.js'
    }
  }
}