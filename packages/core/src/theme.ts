import { CellState, CalendarDay } from './calendar'
import { ref, computed } from 'vue'
import { Refable, refNormalize } from './utils'

export interface Theme {
  cell?: CellStyleConfig | CellStyleFunction
}

export type CellStyleInterceptor = (
  day: CalendarDay,
  state: CellState,
  prev: CellStyle
) => CellStyle

export function useTheme(theme: Refable<Theme>) {
  const themeRef = refNormalize(theme)

  const cellStyleInterceptors = ref<CellStyleInterceptor[]>([])
  const cellStyleFn = computed(() => {
    let styleFn: CellStyleFunction

    if (typeof themeRef.value.cell === 'function') {
      styleFn = themeRef.value.cell
    } else {
      styleFn = getCellStyleFunction(themeRef.value.cell || {})
    }

    return (state: CellState, day: CalendarDay) => {
      let style = styleFn(state, day)
      for (const interceptor of cellStyleInterceptors.value) {
        style = interceptor(day, state, style)
      }
      return style
    }
  })

  return {
    cellStyleFn,
    cellStyleInterceptors
  }
}

export type CellStyle = Partial<CSSStyleDeclaration>

export type CellStyleFunction = (
  state: CellState,
  day: CalendarDay
) => CellStyle

export interface CellStyleConfig
  extends Partial<Record<keyof CellState, CellStyle>> {
  base?: CellStyle
}

export function useCellState(baseState: Refable<Omit<CellState, 'active'>>) {
  const normalizedBaseState = refNormalize(baseState)
  const active = ref(false)
  const state = computed(() => ({
    ...normalizedBaseState.value,
    active: active.value
  }))

  return {
    active,
    state
  }
}

function getCellStyleFunction(config: CellStyleConfig): CellStyleFunction {
  return (state: CellState) => {
    let style = config.base || {}

    if (!state.currentMonth) {
      return style
    }

    style = {
      ...style,
      ...config.currentMonth
    }

    if (state.selectable) {
      style = {
        ...style,
        ...config.selectable
      }
    }

    if (state.selected) {
      style = {
        ...style,
        ...config.selected
      }
      return style
    }

    if (!state.selectable) {
      return style
    }

    if (state.inSelection || state.inShadowSelection) {
      style = {
        ...style,
        ...config.inSelection
      }
    }

    if (state.hovered) {
      style = {
        ...style,
        ...config.hovered
      }
    }

    if (state.active) {
      style = {
        ...style,
        ...config.active
      }
    }

    return style
  }
}
