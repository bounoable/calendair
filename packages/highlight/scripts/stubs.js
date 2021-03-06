module.exports.App = `<script lang="ts">
import { defineComponent, ref } from 'vue'
import Sandbox from '@calendair/core/src/dev/Sandbox.vue'
import { Options } from '@calendair/core'
import HighlightPlugin from './index'

export default defineComponent({
  components: { Sandbox },

  setup() {
    const options = ref<Options>({
      plugins: [
        HighlightPlugin({
          
        }),
      ],
    })

    return {
      options,
    }
  }
})
</script>

<template>
  <Sandbox :options="options"/>
</template>
`
