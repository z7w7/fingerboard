import { babel } from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import eslint from '@rollup/plugin-eslint'
import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import del from 'rollup-plugin-delete'
import pkg from './package.json'

export default {
  input: 'src/index.tsx',
  output: [
    {
      name: 'z-fingerboard',
      file: pkg.main,
      format: 'umd',
      globals: {
        'react': 'React',
        'lodash': 'lodash'
      }
    },
    {
      file: pkg.module,
      format: 'esm'
    }
  ],
  plugins: [
    del({
      targets: 'dist/*' // 打包前清空dist文件夹
    }),
    postcss({
      extract: 'index.min.css', // 抽离css文件
      plugins: [
        autoprefixer, // css兼容处理
        cssnano // css压缩
      ]
    }),
    babel({
      babelHelpers: 'bundled' // js兼容处理
    }),
    typescript(), // 支持ts
    eslint({
      throwOnError: true, // 报错时退出程序
      include: ['src/**/*.ts', 'src/**/*.tsx'] // 需要检查的文件
    }),
    terser() // js压缩
  ],
  external: [ // 外部依赖
    'react',
    'lodash'
  ]
}
