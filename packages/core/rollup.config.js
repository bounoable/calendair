import vue from 'rollup-plugin-vue'
import ts from 'rollup-plugin-typescript2'
import typescript from 'typescript'
// import postcss from 'rollup-plugin-postcss'
// import tailwind from 'tailwindcss'
// import autoprefixer from 'autoprefixer'
// import cssnano from 'cssnano'
import pkg from './package.json'

export default {
  input: 'src/index.ts',

  output: {
    format: 'esm',
    dir: './dist',
    entryFileNames: 'calendair.js',
    sourcemap: true
  },

  plugins: [
    ts({
      typescript
    }),
    vue({
      // style: {
      //   postcssPlugins: [
      //     require('tailwindcss')('../../tailwind.config.js'),
      //     require('autoprefixer')(),
      //     require('cssnano')({
      //       preset: 'default',
      //     }),
      //   ]
      // }
    })
    // ts(),
    // postcss({
    //   plugins: [
    //     tailwind('../../tailwind.config.js'),
    //     autoprefixer(),
    //     cssnano({ preset: 'default' })
    //   ],
    // }),
  ],

  external: Object.keys(pkg.dependencies)
}
