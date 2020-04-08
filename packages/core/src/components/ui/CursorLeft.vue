<script lang="ts">
import { defineComponent } from 'vue'
import Cursor from './Cursor.vue'

export default defineComponent({
  components: { Cursor }
})
</script>

<template>
  <Cursor
    class="CalendairCursorLeft"
    path="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z"
    v-bind="$attrs"
  />
</template>

<style lang="sass" scoped>
.CalendairCursorLeft
  @apply top-0 left-0
</style>
