module.exports.App = `<script lang="ts">
import { defineComponent, ref } from 'vue'
import Sandbox from './dev/Sandbox.vue'
import { Options } from './options'

export default defineComponent({
  components: { Sandbox },

  setup() {
    const options = ref<Options>({})

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
