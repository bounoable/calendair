import { ref, RenderFunction, h } from 'vue'
import { CalendarDay, CellState } from './calendar'
import DateRenderer from './components/cell/DateRenderer'

export type CellRenderer = (
  day: CalendarDay,
  state: CellState
) => ReturnType<RenderFunction>

export function useRendering() {
  const cellRenderers = ref<CellRenderer[]>([])
  const withCellRenderer = (renderFn: CellRenderer) =>
    cellRenderers.value.push(renderFn)

  withCellRenderer(day => {
    return day.isCurrentMonth ? h(DateRenderer, { date: day.date }) : undefined
  })

  return {
    cellRenderers,
    withCellRenderer
  }
}
