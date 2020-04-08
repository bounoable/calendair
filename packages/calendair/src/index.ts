import { Plugin } from 'vue'
import { Calendar as Calendair, Options } from '@calendair/core'

export interface VuePluginOptions {
  name?: string
}

const VuePlugin: Plugin = (app, ...options: VuePluginOptions[]) => {
  const opts = options.reduce((prev, cur) => ({
    ...prev,
    ...cur,
  }), {})

  app.component(opts.name || 'Calendair', Calendair)
}

export { VuePlugin, Calendair, Options }
