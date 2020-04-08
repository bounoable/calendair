const pkg = require('./package.json')

const postcssPlugins = [require('tailwindcss')('../../tailwind.config.js')]

if (process.env.NODE_ENV === 'production') {
  postcssPlugins.push(
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.vue'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  )
}

module.exports = {
  lintOnSave: false,
  css: {
    extract: false,
    loaderOptions: {
      postcss: {
        plugins: postcssPlugins
      }
    }
  },

  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.externals(Object.keys(pkg.dependencies).concat('date-fns/esm'))
    }
  }
}
