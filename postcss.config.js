
module.exports={
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    "autoprefixer": {
      "browsers": [
        'last 2 versions', 'ios>=7.0', 'Android>=4.3'
      ]
    },
    "postcss-px-to-viewport-c": {
      viewportWidth: 750,
      viewportHeight: 1334,
      unitPrecision: 3,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines'],
      minPixelValue: 1,
      mediaQuery: false,
      exclude: /(\/|\\)(node_modules)(\/|\\)/
    }
  }
}