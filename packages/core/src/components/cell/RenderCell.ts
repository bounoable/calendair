import { defineComponent, Prop } from 'vue'
import { CellRenderer } from '../../rendering'
import { CalendarDay, CellState } from '../../calendar'

export default defineComponent({
  props: {
    day: { type: Object, required: true } as Prop<CalendarDay>,
    state: { type: Object, required: true } as Prop<CellState>,
    renderFn: { type: Function, required: true } as Prop<CellRenderer>
  },

  setup(props) {
    return () => props.renderFn!(props.day!, props.state!)
  }
})
