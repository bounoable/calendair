<script lang="ts">
import { defineComponent, ref } from 'vue'
import Calendar from '../components/Calendar.vue'
import { Options } from '../options'

export default defineComponent({
  components: { Calendar },

  setup() {
    const options = ref<Options>({})

    return {
      options
    }
  }
})
</script>

<template>
  <div>
    <Calendar :options="options" />
  </div>
</template>

<style lang="sass" scoped></style>
