<script lang="ts">
import { defineComponent, computed, Prop } from 'vue'
import { startAndEndOfMonth, useCalendarMonth } from '../calendar'
import { useLocale } from '../locale'

export default defineComponent({
  props: {
    locale: { type: Object, required: true } as Prop<
      ReturnType<typeof useLocale>
    >,
    year: { type: Number, required: true },
    month: { type: Number, required: true }
  },

  setup(props) {
    const period = computed(() => startAndEndOfMonth(props.year, props.month))
    const { rows } = useCalendarMonth(computed(() => period.value.start))

    return {
      period,
      rows
    }
  }
})
</script>

<template>
  <div class="CalendairMonth" v-bind="$attrs">
    <header class="CalendairMonth__header">
      {{ locale.formatDate(period.start, 'MMMM yyyy') }}
    </header>

    <div class="CalendairMonth__calendar">
      <div class="CalendairMonth__row">
        <div
          class="CalendairMonth__heading"
          v-for="weekday of locale.weekdaysShort"
          :key="weekday"
          v-text="weekday"
        ></div>
      </div>

      <div v-for="(row, r) of rows" :key="r" class="CalendairMonth__row">
        <template v-for="(day, d) of row.days">
          <slot name="cell" v-if="$slots.cell" :key="r * 7 + d" :day="day" />
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.CalendairMonth__header
  @apply text-center text-xl font-semibold text-gray-700

.CalendairMonth__calendar
  @apply mt-4 pt-px pl-px

.CalendairMonth__row
  @apply flex

.CalendairMonth__heading
  @apply flex-1 text-center text-sm text-gray-600 py-2
</style>
