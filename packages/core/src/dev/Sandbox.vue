<script lang="ts">
import { defineComponent, ref, computed, Prop } from 'vue'
import { Options } from '../options'
import Calendar from '../components/Calendar.vue'

const widths = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  'full'
]

export default defineComponent({
  components: { Calendar },
  props: {
    options: { type: Object, default: () => ({}) } as Prop<Options>
  },

  setup() {
    const width = ref('2xl')
    const bodySizeClass = computed(() => `max-w-${width.value}`)

    return {
      widths,
      width,
      bodySizeClass
    }
  }
})
</script>

<template>
  <div class="Sandbox">
    <div class="Sandbox__body max-w-2xl">
      <h1 class="Sandbox__title">Sandbox</h1>

      <p class="Sandbox__label">Container</p>
      <div class="overflow-x-auto">
        <div class="flex -m-1">
          <div class="p-1" v-for="w of widths" :key="w">
            <button
              class="Sandbox__btn"
              :class="{
                'is-active': w === width
              }"
              type="button"
              v-text="w"
              @click="width = w"
            />
          </div>
        </div>
      </div>

      <slot v-if="$slots.menu" name="menu" />
    </div>

    <div class="Sandbox__body" :class="bodySizeClass">
      <div class="Sandbox__calendar">
        <Calendar :options="options" />
      </div>
    </div>
  </div>
</template>

<style lang="sass">
/* purgecss start ignore */
@tailwind base
@tailwind components
/* purgecss end ignore */
@tailwind utilities
</style>

<style lang="sass" scoped>
.Sandbox
  @apply p-4

  @screen md
    @apply px-8 py-16

.Sandbox__body
  @apply w-full mx-auto

.Sandbox__title
  @apply text-2xl font-medium text-gray-800 text-center mb-4

.Sandbox__label
  @apply font-medium text-gray-700 mb-2

.Sandbox__calendar
  @apply mt-8 border rounded-sm p-4

.Sandbox__btn
  @apply border rounded-sm bg-white px-3 py-1 text-sm text-gray-700 outline-none duration-100

  @screen lg
    &:hover
      @apply border-blue-300

  &.is-active
    @apply bg-blue-100 text-blue-700 border-blue-300
</style>
