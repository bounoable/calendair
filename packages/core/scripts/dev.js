const fs = require('fs-extra')
const path = require('path')
const { App } = require('./stubs')

const pkgDir = path.resolve(__dirname, '..')

dev()

function dev() {
  const appPath = path.join(pkgDir, 'src/App.vue')

  if (!fs.existsSync(appPath)) {
    fs.writeFileSync(appPath, App)
  }

  process.argv = process.argv.slice(0, 2).concat('serve')

  require('@vue/cli-service/bin/vue-cli-service.js')
}
