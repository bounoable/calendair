import { watch, computed, Ref, h } from 'vue'
import CheckDay from './components/cell/CheckDay.vue'
import { Options } from './options'
import {
  Plugin,
  Refable,
  refNormalize,
  normalizeDateOrDateRanges,
  InstallContext
} from '@calendair/core'
import {
  trimPeriod,
  isFullyBlockedDate,
  isCheckInDay,
  isCheckOutDay,
  isCheckInOutDay
} from './utils'
import { startOfDay } from 'date-fns/esm'
import {
  validateSelectionStart,
  validateSelectionEnd,
  isSelectableWeekday
} from './validate'
import { useCache, Cache } from './cache'

export default function BookingPlugin(options?: Refable<Options>) {
  const opts = computed(() => {
    const normalized = refNormalize(options || {})

    return {
      ...normalized.value,
      blocked:
        normalized.value.blocked?.map(period => [
          startOfDay(period[0]),
          startOfDay(period[1])
        ]) || []
    } as Options
  })

  const cache = useCache(opts)

  const plugin: Plugin = ctx => {
    enableDisableDates(ctx, opts)
    patchTheme(ctx, opts, cache)
    renderCheckInOutDays(ctx, opts, cache)
    validateCheckInOutDays(ctx, opts, cache)
  }

  return plugin
}

function enableDisableDates(ctx: InstallContext, options: Ref<Options>) {
  const enabledDates = computed(() =>
    normalizeDateOrDateRanges(refNormalize(options.value?.enabled).value || [])
  )
  const disabledDates = computed(() =>
    normalizeDateOrDateRanges(refNormalize(options.value?.disabled).value || [])
  )

  watch(
    enabledDates,
    enabled => {
      ctx.selection.enabledDates.value = enabled
    },
    { immediate: true }
  )

  watch(
    disabledDates,
    disabled => {
      ctx.selection.disabledDates.value = disabled.concat(
        options.value.blocked?.map(period => trimPeriod(period, 1)) || []
      )
    },
    { immediate: true }
  )
}

function patchTheme(ctx: InstallContext, options: Ref<Options>, cache: Cache) {
  ctx.theme.cellStyleInterceptors.value.push((day, state, prev) => {
    const fullyBlocked = cache.remember(
      `isFullyBlockedDate:${day.date.getTime()}`,
      () => isFullyBlockedDate(day.date, options.value)
    )

    if (!fullyBlocked) {
      return prev
    }

    return {
      ...prev,
      zIndex: '1',
      opacity: '1',
      color: '#fc8181',
      borderColor: '#feb2b2'
    }
  })
}

function renderCheckInOutDays(
  ctx: InstallContext,
  options: Ref<Options>,
  cache: Cache
) {
  ctx.rendering.withCellRenderer((day, state) => {
    if (state.hovered || state.selected) {
      return
    }

    const time = day.date.getTime()
    const checkInOutDay = cache.remember(`isCheckInOutDay:${time}`, () =>
      isCheckInOutDay(day.date, options.value)
    )

    if (!options.value.allowOverlap && checkInOutDay) {
      return
    }

    const blockedPeriods = options.value.blocked || []

    const checkInDay = cache.remember(`isCheckInDay:${time}`, () =>
      isCheckInDay(day.date, blockedPeriods)
    )
    const checkOutDay = cache.remember(`isCheckOutDay:${time}`, () =>
      isCheckOutDay(day.date, blockedPeriods)
    )

    if (checkInDay) {
      return h(CheckDay, { mode: 'checkIn' })
    }

    if (checkOutDay) {
      return h(CheckDay, { mode: 'checkOut' })
    }
  })

  ctx.selection.interceptors.selectable.value.push((date, ctx, prev) => {
    if (!prev) {
      return prev
    }

    const checkInOutDay = cache.remember(
      `isCheckInOutDay:${date.getTime()}`,
      () => isCheckInOutDay(date, options.value)
    )

    if (!options.value.allowOverlap && checkInOutDay) {
      return false
    }

    return prev
  })
}

function validateCheckInOutDays(
  ctx: InstallContext,
  options: Ref<Options>,
  cache: Cache
) {
  ctx.selection.interceptors.selectable.value.push((date, ctx, prev) => {
    if (!prev) {
      return prev
    }

    if (!options.value.minDays) {
      return true
    }

    const minDays =
      typeof options.value.minDays === 'function'
        ? options.value.minDays(date)
        : options.value.minDays

    const maxGap =
      typeof options.value.maxGap === 'function'
        ? options.value.maxGap(date)
        : options.value.maxGap || 0

    const selectableWeekday = cache.remember(
      `isSelectableWeekday:${date.getTime()}`,
      () => isSelectableWeekday(date, options.value)
    )

    if (
      !validateSelectionStart(
        date,
        ctx.selection,
        options.value,
        cache,
        minDays,
        maxGap,
        selectableWeekday
      )
    ) {
      return false
    }

    if (
      !validateSelectionEnd(
        date,
        ctx.selection,
        options.value,
        cache,
        minDays,
        maxGap,
        selectableWeekday
      )
    ) {
      return false
    }

    return prev
  })
}
