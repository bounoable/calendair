import ts from 'rollup-plugin-typescript2'
// import nodeResolve from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'

export default [
  {
    input: 'src/index.ts',

    output: {
      format: 'esm',
      dir: './dist',
      entryFileNames: 'index.js'
    },

    plugins: [ts()],

    external: Object.keys(pkg.dependencies).concat('date-fns/esm')
  }
  // {
  //   input: 'src/index.ts',

  //   output: {
  //     format: 'cjs',
  //     dir: './dist',
  //     entryFileNames: 'index.common.js',
  //   },

  //   plugins: [
  //     commonjs({
  //       // namedExports: {
  //       //   '@calendair/core': ['Calendar'],
  //       // }
  //     }),
  //     ts({ declaration: false }),
  //     nodeResolve()
  //   ],

  //   external: Object.keys(pkg.dependencies),
  // },
  // {
  //   input: 'src/index.ts',

  //   output: {
  //     format: 'umd',
  //     dir: './dist',
  //     entryFileNames: 'index.umd.js',
  //     name: 'calendair',
  //     globals: {
  //       vue: 'Vue',
  //     },
  //   },

  //   plugins: [
  //     commonjs({
  //       // namedExports: {
  //       //   '@calendair/core': ['Calendar'],
  //       // }
  //     }),
  //     ts({ declaration: false }),
  //     nodeResolve()
  //   ],

  //   external: ['vue'],
  // },
]
