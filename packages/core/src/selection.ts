import { ref, Ref, computed, watch } from 'vue'
import {
  isEqual,
  isAfter,
  isBefore,
  areIntervalsOverlapping
} from 'date-fns/esm'
import { DateOrDateRange } from './shared'
import { Refable, refNormalizeOptions } from './utils'

export interface ReadySelectionOptions {
  /**
   * Selection mode. Can be either "date" or "period".
   * "date" mode means a single date selection.
   * "period" mode means a two-date (period) selection.
   */
  mode: SelectionMode

  /**
   * Reset the selected dates after a selection.
   */
  clearAfterSelect: boolean
}

export type SelectionOptions = Partial<ReadySelectionOptions>

export type SelectableInterceptor = (
  date: Date,
  ctx: {
    selection: Selection
    inSelection: boolean
    inShadowSelection: boolean
    selected: boolean
  },
  prev: boolean
) => boolean

export type Selection = [...Date[]]

export enum SelectionMode {
  Date = 'date',
  Period = 'period'
}

export const defaultSelectionOptions: ReadySelectionOptions = {
  mode: SelectionMode.Period,
  clearAfterSelect: false
}

export function useSelection(options?: Refable<SelectionOptions>) {
  const opts = refNormalizeOptions(options, defaultSelectionOptions)
  const selection = ref<Selection>([])
  const hoveredDate = ref<Date | null>(null) as Ref<Date | null>
  const enabledDates = ref<DateOrDateRange[]>([])
  const disabledDates = ref<DateOrDateRange[]>([])
  const selectableInterceptors = ref<SelectableInterceptor[]>([])
  const mode = computed(() => opts.value.mode)

  const inSelection = (date: Date) =>
    _inSelection(selection.value, date, opts.value.mode)
  const inShadowSelection = (date: Date) =>
    _inShadowSelection(
      selection.value,
      hoveredDate.value as Date | null,
      date,
      opts.value.mode
    )
  const isSelected = (date: Date) => _isSelected(selection.value, date)

  const isSelectable = (date: Date) => {
    let result = _isSelectable(
      selection.value,
      disabledDates.value,
      enabledDates.value,
      date
    )
    const isInSelection = inSelection(date)
    const isInShadowSelection = inShadowSelection(date)
    const selected = isSelected(date)

    for (const intercept of selectableInterceptors.value) {
      result = intercept(
        date,
        {
          selected,
          selection: selection.value,
          inSelection: isInSelection,
          inShadowSelection: isInShadowSelection
        },
        result
      )
    }

    return result
  }

  const selectDate = (date: Date) => {
    if (selection.value.length >= maxSelectionCount[opts.value.mode]) {
      selection.value = [date]
      return
    }

    if (isSelected(date)) {
      selection.value.splice(
        selection.value.findIndex(sdate => sdate.getTime() === date.getTime()),
        1
      )
      return
    }

    selection.value = _addToSelection(selection.value, date)
  }

  const interceptors = {
    selectable: selectableInterceptors
  }

  const onSelectedFns: Array<(selection: Selection) => any> = []
  const onSelected = (cb: (selection: Selection) => any) =>
    onSelectedFns.push(cb)

  watch(
    selection,
    sel => {
      if (sel.length >= maxSelectionCount[mode.value]) {
        for (const cb of onSelectedFns) {
          cb(sel)
        }

        if (opts.value.clearAfterSelect) {
          selection.value = []
        }
      }
    },
    { immediate: true }
  )

  return {
    selection,
    hoveredDate,
    interceptors,
    enabledDates,
    disabledDates,
    mode,
    selectDate,
    inSelection,
    inShadowSelection,
    isSelected,
    isSelectable,
    onSelected
  }
}

const maxSelectionCount = {
  [SelectionMode.Date]: 1,
  [SelectionMode.Period]: 2
}

function _isSelected(selection: Selection, date: Date) {
  return selection.findIndex(sdate => sdate.getTime() === date.getTime()) > -1
}

function _inSelection(selection: Selection, date: Date, mode: SelectionMode) {
  if (selection.length < maxSelectionCount[mode]) {
    return _isSelected(selection, date)
  }

  if (mode === SelectionMode.Date) {
    return false
  }

  return (
    date.getTime() >= selection[0].getTime() &&
    date.getTime() <= selection[selection.length - 1].getTime()
  )
}

function _inShadowSelection(
  selection: Selection,
  hoveredDate: Date | null,
  date: Date,
  mode: SelectionMode
) {
  if (_inSelection(selection, date, mode)) {
    return true
  }

  if (mode === SelectionMode.Date) {
    return false
  }

  if (!hoveredDate || selection.length >= maxSelectionCount[mode]) {
    return false
  }

  let sel = selection.slice()
  sel.push(hoveredDate)
  sel = _sortSelection(sel)

  return _inSelection(sel, date, mode)
}

function _isSelectable(
  selection: Selection,
  disabled: Array<Date | [Date, Date]>,
  enabled: Array<Date | [Date, Date]>,
  date: Date
) {
  if (_isDisabled(disabled, enabled, date)) {
    return false
  }

  if (selection.length === 1) {
    const sortedSel = _sortSelection([selection[0], date])
    if (_isDisabledRange(disabled, enabled, [sortedSel[0], sortedSel[1]])) {
      return false
    }
  }

  return true
}

function _isDisabled(
  disabled: Array<Date | [Date, Date]>,
  enabled: Array<Date | [Date, Date]>,
  date: Date
) {
  if (enabled.length) {
    if (
      !enabled.find(d => {
        if (d instanceof Date) {
          return d.getTime() === date.getTime()
        }

        return (
          isEqual(date, d[0]) ||
          isEqual(date, d[1]) ||
          (isAfter(date, d[0]) && isBefore(date, d[1]))
        )
      })
    ) {
      return true
    }
  }

  return !!disabled.find(d => {
    if (d instanceof Date) {
      return d.getTime() === date.getTime()
    }

    return (
      isEqual(date, d[0]) ||
      isEqual(date, d[1]) ||
      (isAfter(date, d[0]) && isBefore(date, d[1]))
    )
  })
}

function _isDisabledRange(
  disabled: Array<Date | [Date, Date]>,
  enabled: Array<Date | [Date, Date]>,
  range: [Date, Date]
) {
  if (enabled.length) {
    if (
      !enabled.find(d => {
        if (d instanceof Date) {
          return (
            isEqual(d, range[0]) ||
            isEqual(d, range[1]) ||
            (isAfter(d, range[0]) && isBefore(d, range[1]))
          )
        }

        return areIntervalsOverlapping(
          { start: d[0], end: d[1] },
          { start: range[0], end: range[1] },
          { inclusive: true }
        )
      })
    ) {
      return true
    }
  }

  return !!disabled.find(d => {
    if (d instanceof Date) {
      return (
        isEqual(d, range[0]) ||
        isEqual(d, range[1]) ||
        (isAfter(d, range[0]) && isBefore(d, range[1]))
      )
    }

    return areIntervalsOverlapping(
      { start: d[0], end: d[1] },
      { start: range[0], end: range[1] },
      { inclusive: true }
    )
  })
}

function _addToSelection(selection: Selection, date: Date) {
  const newSelection = selection.slice()
  newSelection.push(date)
  return _sortSelection(newSelection)
}

function _sortSelection(selection: Selection) {
  return sortDates(selection) as Selection
}

export function sortDates<T extends [...Date[]]>(dates: T) {
  return dates
    .slice()
    .sort((a, b) => (a.getTime() <= b.getTime() ? -1 : 1)) as T
}
