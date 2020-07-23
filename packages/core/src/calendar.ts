import {
  ref,
  Ref,
  computed,
  ComputedRef,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { Period, shiftPeriod } from './shared'
import { ResizeObserver } from '@juggle/resize-observer'
import {
  endOfMonth,
  eachDayOfInterval,
  subMonths,
  addMonths,
  isBefore,
  isAfter,
} from 'date-fns/esm'
import { Refable, refNormalize, refNormalizeOptions } from './utils'

export interface ReadyCalendarOptions {
  /**
   * Maximum calendar months that are displayed at once.
   */
  maxVisibleMonths: number

  /**
   * The first month of the calendar that can be viewed.
   */
  firstMonth?: Date

  /**
   * The last month of the calendar that can be viewed.
   */
  lastMonth?: Date

  /**
   * The initial shown month.
   */
  initialMonth: Date

  /**
   * The first day of the week.
   */
  startWeekOn: Weekday
}

export enum Weekday {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thurday,
  Friday,
  Saturday,
}

export type CalendarOptions = Partial<ReadyCalendarOptions>

export const defaultOptions: ReadyCalendarOptions = {
  maxVisibleMonths: 12,
  initialMonth: new Date(),
  startWeekOn: Weekday.Sunday,
}

export function useCalendar(
  el: Refable<HTMLElement | null>,
  options?: Refable<CalendarOptions>
) {
  const calendarEl = refNormalize(el)
  const opts = refNormalizeOptions(options, defaultOptions)

  const mainMonth = ref(
    startAndEndOfMonth(
      opts.value.initialMonth.getFullYear(),
      opts.value.initialMonth.getMonth()
    )
  ) as Ref<Period>

  const maxVisibleMonths = computed(() =>
    _maxVisibleMonths(mainMonth.value, opts.value.maxVisibleMonths)
  )

  const visibleMonths = computed(() => {
    const months = calendarEl.value
      ? _visibleMonths(calendarEl.value, maxVisibleMonths.value)
      : []

    return opts.value.firstMonth || opts.value.lastMonth
      ? months.filter((month) => {
          if (
            opts.value.firstMonth &&
            isBefore(month.end, opts.value.firstMonth)
          ) {
            return false
          }

          if (
            opts.value.lastMonth &&
            isAfter(month.start, opts.value.lastMonth)
          ) {
            return false
          }

          return true
        })
      : months
  }) as ComputedRef<Period[]>

  // Force recomputation of visibleMonths by reassigning calendarEl
  const resizeObserver = new ResizeObserver(
    () => (calendarEl.value = calendarEl.value)
  )

  onMounted(() => {
    if (!calendarEl.value) {
      return
    }
    resizeObserver.observe(calendarEl.value)
  })

  onBeforeUnmount(resizeObserver.disconnect)

  // Render more months than visible for the transition to work
  const renderedMonths = computed(() => {
    if (!visibleMonths.value.length) {
      return visibleMonths.value
    }

    const months = visibleMonths.value.slice()
    months.unshift(
      shiftPeriod(months[0] as Period, -2),
      shiftPeriod(months[0] as Period, -1)
    )
    months.push(
      shiftPeriod(months[months.length - 1] as Period, 1),
      shiftPeriod(months[months.length - 1] as Period, 2)
    )

    return months
  }) as ComputedRef<Period[]>

  const cursorAllowed = (months: number) =>
    calendarEl.value
      ? _cursorAllowed(months, calendarEl.value, mainMonth.value, opts.value)
      : false

  const cursor = (months: number) => {
    if (!cursorAllowed(months)) {
      return
    }

    mainMonth.value = shiftPeriod(mainMonth.value as Period, months)
  }

  return {
    mainMonth,
    maxVisibleMonths,
    visibleMonths,
    renderedMonths,
    cursor,
    cursorAllowed,
    options: opts,
  }
}

function _cursorAllowed(
  months: number,
  calendarEl: HTMLElement,
  mainMonth: Period,
  options: ReadyCalendarOptions
) {
  const shiftedMain = shiftPeriod(mainMonth as Period, months)
  const shiftedMaxVisibleMonths = _maxVisibleMonths(
    shiftedMain,
    options.maxVisibleMonths
  )
  const shiftedVisibleMonths = _visibleMonths(
    calendarEl,
    shiftedMaxVisibleMonths
  )

  if (
    options.firstMonth &&
    isBefore(shiftedVisibleMonths[0].end, options.firstMonth)
  ) {
    return false
  }

  if (
    options.lastMonth &&
    isAfter(
      shiftedVisibleMonths[shiftedVisibleMonths.length - 1].start,
      options.lastMonth
    )
  ) {
    return false
  }

  return true
}

function _maxVisibleMonths(mainMonth: Period, maxVisibleMonths: number) {
  const calendars = [mainMonth]

  for (let i = 1; i < maxVisibleMonths; i++) {
    calendars[i] = shiftPeriod(mainMonth as Period, i)
  }

  return calendars
}

function _visibleMonths(calendarEl: HTMLElement, maxVisibleMonths: Period[]) {
  let maxCount = Math.floor(calendarEl.getBoundingClientRect().width / 300)
  maxCount = maxCount < 1 ? 1 : maxCount
  return maxVisibleMonths.slice(0, maxCount)
}

export interface CalendarMonthPositioningStyles {
  position: CSSStyleDeclaration['position']
  width: CSSStyleDeclaration['width']
  left: CSSStyleDeclaration['left']
}

export function useCalendarStyle(
  renderedMonths: Ref<Period[]>,
  visibleMonths: Ref<Period[]>
) {
  const monthStyles = computed(() => {
    const styles: {
      [key: number]: { [key: number]: CalendarMonthPositioningStyles }
    } = {}

    for (let i = 0; i < renderedMonths.value.length; ++i) {
      const widthPercentage = 100 / visibleMonths.value.length

      let width: CSSStyleDeclaration['width'] = widthPercentage + '%'
      let position: CSSStyleDeclaration['position'] = 'static'
      let left: CSSStyleDeclaration['left'] = 'auto'

      if (visibleMonths.value.indexOf(renderedMonths.value[i]) > -1) {
        position = 'static'
        width = '100%'
      } else {
        position = 'absolute'
        left = -widthPercentage * 2 + i * widthPercentage + '%'
      }

      styles[renderedMonths.value[i].start.getFullYear()] =
        styles[renderedMonths.value[i].start.getFullYear()] || {}
      styles[renderedMonths.value[i].start.getFullYear()][
        renderedMonths.value[i].start.getMonth()
      ] = {
        position,
        width,
        left,
      }
    }

    return styles
  })

  return {
    monthStyles,
  }
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
}

export interface CalendarMonthRow {
  days: CalendarDay[]
}

export function startAndEndOfMonth(year: number, month: number): Period {
  const start = new Date(year, month, 1, 0, 0, 0, 0)
  const end = endOfMonth(start)

  return {
    start,
    end,
  }
}

export function useCalendarMonth(
  firstOfMonth: Ref<Date>,
  options: Ref<ReadyCalendarOptions>
) {
  const lastOfMonth = computed(() => endOfMonth(firstOfMonth.value))

  const currentMonthDates = computed(() => {
    return eachDayOfInterval({
      start: firstOfMonth.value,
      end: lastOfMonth.value,
    })
  })

  const prevMonthDates = computed(() => {
    const start = subMonths(firstOfMonth.value, 1)
    const end = endOfMonth(start)
    return eachDayOfInterval({ start, end })
  })

  const nextMonthDates = computed(() => {
    const start = addMonths(firstOfMonth.value, 1)
    const end = endOfMonth(start)
    return eachDayOfInterval({ start, end })
  })

  const days = computed(() => {
    const days: CalendarDay[] = []
    const firstOfMonthDay = firstOfMonth.value.getDay()

    const overflow = (firstOfMonthDay + (7 - options.value.startWeekOn)) % 7
    for (let i = 0; i < overflow; i++) {
      const index = prevMonthDates.value.length - (overflow - i)
      const date = prevMonthDates.value[index]
      days.push({ date, isCurrentMonth: false })
    }

    for (const date of currentMonthDates.value) {
      days.push({ date, isCurrentMonth: true })
    }

    const remaining = 7 - (days.length % 7)

    for (let i = 0; i < remaining; i++) {
      const date = nextMonthDates.value[i]
      days.push({ date, isCurrentMonth: false })
    }

    return days
  })

  const rows = computed(() => {
    const count = Math.ceil(days.value.length / 7)
    const rows: CalendarMonthRow[] = []

    for (let i = 0; i < count; i++) {
      const rowDays: CalendarDay[] = []
      for (let c = i * 7; c < (i + 1) * 7; ++c) {
        rowDays.push(days.value[c])
      }
      rows.push({ days: rowDays })
    }

    return rows
  })

  return {
    firstOfMonth,
    lastOfMonth,
    currentMonthDates,
    prevMonthDates,
    nextMonthDates,
    days,
    rows,
  }
}

export interface CellState {
  currentMonth: boolean
  hovered: boolean
  active: boolean
  disabled: boolean
  selectable: boolean
  selected: boolean
  inSelection: boolean
  inShadowSelection: boolean
}
