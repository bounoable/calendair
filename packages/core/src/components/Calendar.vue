<script lang="ts">
import { defineComponent, ref, Ref, computed, Prop } from 'vue'
import CalendarMonth from './CalendarMonth.vue'
import BaseCell from './cell/BaseCell.vue'
import CursorLeft from './ui/CursorLeft.vue'
import CursorRight from './ui/CursorRight.vue'
import { useCalendar, useCalendarStyle, CalendarDay } from '../calendar'
import { periodKey } from '../shared'
import { useSelection } from '../selection'
import { useRendering } from '../rendering'
import { Options } from '../options'
import { useTheme } from '../theme'
import DefaultTheme from '../themes/default'
import { useLocale } from '../locale'

export default defineComponent({
  components: {
    CursorLeft,
    CursorRight,
    CalendarMonth,
    BaseCell,
  },

  props: {
    options: { default: () => ({}) } as Prop<Options>,
  },

  setup(props, { emit }) {
    const options = computed(() => props.options!)
    const el = ref<HTMLElement | null>(null)

    const Calendar = useCalendar(el as Ref<HTMLElement | null>, options)
    const { renderedMonths, visibleMonths, cursor, cursorAllowed } = Calendar

    const Locale = useLocale(options)

    const cursorLeftAllowed = computed(() => cursorAllowed(-1))
    const cursorRightAllowed = computed(() => cursorAllowed(1))

    const Rendering = useRendering()
    const { cellRenderers } = Rendering

    const Theme = useTheme(() => props.options?.theme || DefaultTheme)
    const { cellStyleFn } = Theme

    const { monthStyles } = useCalendarStyle(renderedMonths, visibleMonths)

    const Selection = useSelection(() => options.value.selection || {})
    const {
      selection,
      hoveredDate,
      selectDate,
      inSelection,
      inShadowSelection,
      isSelected,
      isSelectable,
      onSelected,
    } = Selection

    onSelected((sel) => emit('select', sel))

    const pluginCtx = {
      calendar: Calendar,
      rendering: Rendering,
      selection: Selection,
      theme: Theme,
    }

    for (const plugin of options.value.plugins || []) {
      plugin(pluginCtx)
    }

    const onMouseEnter = (day: CalendarDay) => {
      if (!day.isCurrentMonth) {
        hoveredDate.value = null
        return
      }

      hoveredDate.value = day.date
    }

    return {
      Calendar,
      el,
      renderedMonths,
      periodKey,
      cursor,
      cursorLeftAllowed,
      cursorRightAllowed,
      monthStyles,
      selectDate,
      selection,
      hoveredDate,
      isSelected,
      inSelection,
      inShadowSelection,
      isSelectable,
      cellRenderers,
      onMouseEnter,
      cellStyleFn,
      locale: Locale,
    }
  },
})
</script>

<template>
  <div ref="el" class="Calendair">
    <div class="Calendair__controls">
      <transition name="CalendairCursorTransition">
        <CursorLeft v-if="cursorLeftAllowed" @click="cursor(-1)" />
      </transition>

      <transition name="CalendairCursorTransition">
        <CursorRight v-if="cursorRightAllowed" @click="cursor(1)" />
      </transition>
    </div>

    <transition-group
      tag="div"
      name="CalendairMonthTransition"
      class="Calendair__months"
    >
      <template v-for="period of renderedMonths">
        <div
          :key="periodKey(period)"
          :style="
            monthStyles[period.start.getFullYear()][period.start.getMonth()]
          "
          class="Calendair__monthWrapper"
        >
          <CalendarMonth
            :calendar-options="Calendar.options"
            :locale="locale"
            :year="period.start.getFullYear()"
            :month="period.start.getMonth()"
            :selection="selection"
            @mouseleave="hoveredDate = null"
          >
            <template v-slot:cell="{ day }">
              <BaseCell
                :day="day"
                :hovered-date="hoveredDate"
                :selected="isSelected(day.date)"
                :in-selection="inSelection(day.date)"
                :in-shadow-selection="inShadowSelection(day.date)"
                :selectable="isSelectable(day.date)"
                :cell-style-fn="cellStyleFn"
                :renderers="cellRenderers"
                @select="day.isCurrentMonth && selectDate(day.date)"
                @mouseenter="onMouseEnter(day)"
              />
            </template>
          </CalendarMonth>
        </div>
      </template>
    </transition-group>
  </div>
</template>

<style lang="sass" scoped>
.Calendair
  @apply relative

.Calendair__controls
  @apply z-10 relative

.Calendair__months
  @apply flex relative overflow-hidden -mx-4

.Calendair__monthWrapper
  @apply top-0 px-4
  max-width: 100%

/* purgecss start ignore */
.CalendairCursorTransition
  &-enter-active,
  &-leave-active
    @apply duration-200

  &-enter
    @apply opacity-0
    &-to
      @apply opacity-100
  &-leave
    @apply opacity-100
    &-to
      @apply opacity-0

.CalendairMonthTransition
  &-move
    @apply duration-300

  &-enter
    @apply opacity-0
    &-to
      @apply opacity-100
  &-leave
    @apply opacity-100
    &-to
      @apply opacity-0
/* purgecss end ignore */
</style>
