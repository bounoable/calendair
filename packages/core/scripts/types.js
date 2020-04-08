const rimraf = require('rimraf')
const path = require('path')
const execa = require('execa')
const process = require('process')
const fs = require('fs-extra')
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')

const pkgDir = path.resolve(__dirname, '..')

rollupTypes()

async function rollupTypes() {
  rimraf.sync(path.resolve(pkgDir, 'lib'))
  execa.sync('tsc', [
    '--declaration',
    '--emitDeclarationOnly',
    '--outDir',
    './lib',
  ])

  let indexDTs = fs.readFileSync(path.resolve(pkgDir, 'lib/index.d.ts')).toString()
  indexDTs = indexDTs.replace(/^import ([a-z]+) from '.+\.vue';/gi, 'declare const $1: import("vue").ComponentOptions;')
  
  fs.writeFileSync(path.resolve(pkgDir, 'lib/index.d.ts'), indexDTs)

  const extractorConfigPath = path.resolve(pkgDir, 'api-extractor.json')
  const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath)

  const result = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: false
  })

  if (!result.succeeded) {
    console.error(
      `API Extractor completed with ${extractorResult.errorCount} errors` +
        ` and ${extractorResult.warningCount} warnings`
    )
    process.exitCode = 1
    return
  }

  rimraf.sync(path.resolve(pkgDir, 'lib'))
}
