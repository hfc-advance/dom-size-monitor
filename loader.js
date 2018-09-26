
let defaultCssLoader = [
  {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production'
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true
    }
  }
]

let createCssLoader = (type = 'css', options = {}) => {
  let { extract, baseStyle } = options;
  let currentLoaders = [];
  if (type === 'stylus' || type === 'styl') {
    currentLoaders = [
      'stylus-loader'
    ]
    }
    return [
      'cache-loader',
      'style-loader',
      ...defaultCssLoader,
      ...currentLoaders
    ]
};

module.exports = {
  createCssLoader
}