
import { name, version, author } from './package.json';
import alias from 'rollup-plugin-alias';
import { eslint } from 'rollup-plugin-eslint';
import eslintFormate from 'eslint-friendly-formatter';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import filesize from 'rollup-plugin-filesize';
import { uglify } from 'rollup-plugin-uglify';
import { minifyss } from 'uglify-es';
import minifysss from 'rollup-plugin-minify';
import minify from 'rollup-plugin-minify-es';
//! library头部注释
let banner = `${'/*!\n' + ' * '}${name}.js v${version}\n` +
            ` * (c) 2018-${new Date().getFullYear()} ${author}\n` +
            ` * Released under the MIT License.\n` +
            ` */`;
//! 是否是生产环境
let isProd = process.env.NODE_ENV === 'production';
//! library输入
let output = [];
if (isProd) {
  output = [
    //? umd格式
    {
      file: `dist/${name}.js`,
      format: 'umd',
      name,
      banner
    },
    //? commonjs格式
    {
      file: `dist/${name}.cjs.js`,
      format: 'cjs',
      banner
    },
    //? commongjs以及ES6规范格式
    {
      file: `dist/${name}.esm.js`,
      format: 'es',
      banner
    }
  ]
} else {
  output = [
    //? umd格式
    {
      file: `dist/${name}.js`,
      format: 'umd',
      name,
      sourcemap: true
    }
  ]
}
let plugins = [
  //? alias提供拓展名支持，导入的时候可以不带文件后缀
  alias({
    resolve: ['.js', 'json']
  }),
  //? eslint
  eslint({
    include: ['src/**/*.js'],
    //! 格式化eslint输出
    formatter: eslintFormate
  }),
  //? 帮助 Rollup 查找外部模块，然后安装
  resolve(),
  //? rollup-plugin-node-resolve 插件可以解决 ES6模块的查找导入，但是npm中的大多数包都是以CommonJS模块的形式出现的，所以需要使用这个插件将CommonJS模块转换为 ES2015 供 Rollup 处理
  commonjs({
    include: 'node_modules/**',
    exclude: [],
  }),
  //? es6处理
  babel({
    runtimeHelpers: true,
    exclude: 'node_modules/**'
  }),
  //? 内容替换
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  })
]
//? 配置文件
let arr = [{
  input: './src/main.js',
  output,
  plugins
}]
if (isProd) {
  //! 输入library包的大小
  let librarySize = filesize();
  plugins.push(librarySize);
  //! 输入min资源包
  arr.push({
    input: './src/main.js',
    output: [
      //? umd格式
      {
        file: `dist/${name}.min.js`,
        format: 'umd',
        name
      }
    ],
    plugins: [
      ...plugins,
      minify()
    ]
  })
}
export default arr