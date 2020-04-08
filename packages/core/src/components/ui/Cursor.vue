<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    path: String
  }
})
</script>

<template>
  <button class="CalendairCursor" v-bind="$attrs">
    <svg viewBox="0 0 1000 1000" class="CalendairCursor__svg">
      <path :d="path" class="CalendairCursor__arrow" />
    </svg>
  </button>
</template>

<style lang="sass" scoped>
.CalendairCursor
  @apply absolute w-12 px-3 py-2 border rounded-sm outline-none duration-100 bg-white

  @screen lg
    &:hover
      @apply bg-gray-100

  &:active
    @apply bg-gray-200

.CalendairCursor__svg
  @apply w-full

.CalendairCursor__arrow
  fill: #4a5568
</style>
