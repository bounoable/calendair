<script lang="ts">
import { defineComponent, Prop } from 'vue'

const points = {
  checkIn: '0,100 100,0',
  checkOut: '100,0 0,100'
}

export default defineComponent({
  props: {
    mode: {
      type: String,
      default: 'checkIn',
      validator: (mode: any) => ['checkIn', 'checkOut'].indexOf(mode) > -1
    } as Prop<'checkIn' | 'checkOut'>
  },

  setup(props) {
    return {
      points: points[props.mode!]
    }
  }
})
</script>

<template>
  <svg
    class="CheckDaySvg"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    shape-rendering="geometricPrecision"
  >
    <polygon :points="points" fill="#fed7d7" stroke="#feb2b2" />
  </svg>
</template>

<style lang="sass" scoped>
.CheckDaySvg
  @apply w-full h-full
  stroke-width: 2
</style>
