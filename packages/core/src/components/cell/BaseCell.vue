<script lang="ts">
import { defineComponent, computed, Prop } from 'vue'
import RenderCell from './RenderCell'
import { useCellState, CellStyleFunction } from '../../theme'
import { CellRenderer } from '../../rendering'
import { CalendarDay } from '../../calendar'

export default defineComponent({
  components: { RenderCell },

  props: {
    day: { type: Object, required: true } as Prop<CalendarDay>,
    hoveredDate: { type: Date } as Prop<Date>,

    disabled: { type: Boolean, default: false },
    selectable: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    inSelection: { type: Boolean, default: false },
    inShadowSelection: { type: Boolean, default: false },

    cellStyleFn: { type: Function, required: true } as Prop<CellStyleFunction>,
    renderers: { type: Array, default: () => [] } as Prop<CellRenderer[]>
  },

  setup(props, { emit }) {
    const select = () => emit('select')

    const onClick = () => {
      if (!props.selectable) {
        return
      }
      select()
    }

    const hovered = computed(
      () =>
        props.hoveredDate &&
        props.hoveredDate.getTime() === props.day!.date.getTime()
    )

    const CellState = useCellState(
      computed(() => ({
        currentMonth: props.day!.isCurrentMonth,
        hovered: hovered.value as boolean,
        disabled: props.disabled as boolean,
        selectable: props.selectable as boolean,
        selected: props.selected as boolean,
        inSelection: props.inSelection as boolean,
        inShadowSelection: props.inShadowSelection as boolean
      }))
    )

    const { active, state } = CellState

    const style = computed(() => props.cellStyleFn!(state.value, props.day!))

    return {
      select,
      onClick,
      hovered,
      active,
      state,
      style
    }
  }
})
</script>

<template>
  <div
    class="CalendairCell"
    :style="style"
    @click="onClick"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
    @mousedown="active = true"
    @mouseup="active = false"
  >
    <RenderCell
      v-for="(renderer, i) of renderers"
      :key="i"
      :render-fn="renderer"
      :day="day"
      :state="state"
    />
  </div>
</template>

<style lang="sass" scoped>
.CalendairCell
  @apply flex-1 h-10 border border-transparent relative -mt-px -ml-px
</style>
