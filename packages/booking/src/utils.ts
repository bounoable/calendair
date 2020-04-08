import { Options } from './options'
import { sortDates } from '@calendair/core'
import {
  differenceInDays,
  subDays,
  addDays,
  isAfter,
  isEqual,
  isBefore,
  areIntervalsOverlapping
} from 'date-fns/esm'

export function trimPeriod(period: [Date, Date], days: number) {
  if (differenceInDays(period[1], period[0]) <= days) {
    return period
  }

  period = [addDays(period[0], days), subDays(period[1], days)]

  if (isAfter(period[0], period[1])) {
    ;[period[0], period[1]] = [period[1], period[0]]
  }

  return period
}

export function isBlockedDate(date: Date, options: Options) {
  return (
    !!options.blocked?.find(period => periodContains(period, date)) || false
  )
}

export function isFullyBlockedDate(date: Date, options: Options) {
  return (
    !!options.blocked?.find(period =>
      periodContains(trimPeriod(period, options.allowOverlap ? 1 : 0), date)
    ) || false
  )
}

export function isCheckInOutDay(date: Date, options: Options) {
  return (
    !!options.blocked?.find(
      period =>
        period[0].getTime() === date.getTime() ||
        period[1].getTime() === date.getTime()
    ) || false
  )
}

export function isCheckInDay(date: Date, blocked: [Date, Date][]) {
  return (
    !!blocked.find(period => period[0].getTime() === date.getTime()) || false
  )
}

export function isCheckOutDay(date: Date, blocked: [Date, Date][]) {
  return (
    !!blocked.find(period => period[1].getTime() === date.getTime()) || false
  )
}

export function periodContains(period: [Date, Date], date: Date) {
  return (
    isEqual(period[0], date) ||
    isEqual(period[1], date) ||
    (isAfter(date, period[0]) && isBefore(date, period[1]))
  )
}

export function containsDate(dates: Date[], search: Date) {
  return !!dates.find(d => d.getTime() === search.getTime())
}

export function overlapsWithPeriods(
  period: [Date, Date],
  periods: [Date, Date][]
) {
  if (!periods.length) {
    return false
  }

  period = sortDates(period)

  const interval = {
    start: period[0],
    end: period[1]
  }

  return !!periods.find(p =>
    areIntervalsOverlapping(interval, {
      start: p[0],
      end: p[1]
    })
  )
}
