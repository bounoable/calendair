import { Options } from './options'
import { Selection, sortDates } from '@calendair/core'
import {
  isCheckInDay,
  isCheckOutDay,
  overlapsWithPeriods,
  periodContains
} from './utils'
import {
  addDays,
  subDays,
  isBefore,
  differenceInDays,
  isAfter
} from 'date-fns/esm'
import { Cache } from './cache'

export function isSelectableWeekday(date: Date, options: Options) {
  if (!options.selectableWeekdays || !options.selectableWeekdays.length) {
    return true
  }

  return !!options.selectableWeekdays.find(weekday => {
    const day = date.getDay()

    if (typeof weekday === 'number') {
      return weekday === day
    }

    if (periodContains(weekday.period, date)) {
      return weekday.weekdays.find(wd => wd === day)
    }

    return true
  })
}

export function validateSelectionStart(
  date: Date,
  selection: Selection,
  options: Options,
  cache: Cache,
  minDays: number,
  maxGap: number,
  selectableWeekday: boolean
) {
  const time = date.getTime()
  const blockedPeriods = options.blocked || []

  // validate selection start (check-in)
  if (!(selection[0] || selection[1]) || (selection[0] && selection[1])) {
    // shift dates depending on whether check-in & check-out days can overlap
    const shift = options.allowOverlap ? 0 : 1

    const isCheckIn = cache.remember(`isCheckInDay:${time}`, () =>
      isCheckInDay(date, blockedPeriods)
    )
    const isCheckOut = cache.remember(`isCheckOutDay:${time}`, () =>
      isCheckOutDay(date, blockedPeriods)
    )

    // always allow check-in and check-out days to be selected if options.allowGapFill is true
    if (options.allowGapFill && isCheckOut != isCheckIn) {
      return true
    }

    if (
      isCheckOut &&
      !overlapsWithPeriods([date, addDays(date, minDays)], blockedPeriods)
    ) {
      return true
    }

    if (
      isCheckIn &&
      !overlapsWithPeriods([subDays(date, minDays), date], blockedPeriods)
    ) {
      return true
    }

    if (!selectableWeekday) {
      return false
    }

    // allow check-in with a maximum gap to another booking
    for (const blockedPeriod of blockedPeriods) {
      if (isBefore(date, blockedPeriod[0])) {
        // check if date is in the gap zone before a booking and minDays is would be satisfied
        if (
          differenceInDays(blockedPeriod[0], date) <= maxGap + shift &&
          !overlapsWithPeriods([subDays(date, minDays), date], blockedPeriods)
        ) {
          return true
        }
      } else if (isAfter(date, blockedPeriod[1])) {
        // check if date is in the gap zone after a booking and minDays is would be satisfied
        if (
          differenceInDays(date, blockedPeriod[1]) <= maxGap + shift &&
          !overlapsWithPeriods([date, addDays(date, minDays)], blockedPeriods)
        ) {
          return true
        }
      }
    }

    // check if minDays would be satisfied, if selection[0] is not a checkOut and options.allowGapFill is false
    if (
      !options.allowGapFill &&
      !isCheckOut &&
      (overlapsWithPeriods(
        [subDays(date, minDays + shift), date],
        blockedPeriods
      ) ||
        overlapsWithPeriods(
          [date, addDays(date, minDays + shift)],
          blockedPeriods
        ))
    ) {
      return false
    }
  }

  return true
}

export function validateSelectionEnd(
  date: Date,
  selection: Selection,
  options: Options,
  cache: Cache,
  minDays: number,
  maxGap: number,
  selectableWeekday: boolean
) {
  const time = date.getTime()
  const blockedPeriods = options.blocked || []

  // validate selection end
  if (selection[0] && !selection[1]) {
    // shift dates depending on whether check-in & check-out days can overlap
    let shift = options.allowOverlap ? 0 : 1

    const period = sortDates([selection[0], date] as [Date, Date])
    const days = differenceInDays(period[1], period[0])

    // check if selection would wrap a reservation
    if (overlapsWithPeriods(period, blockedPeriods)) {
      return false
    }

    // allow gap fill
    if (days < minDays && options.allowGapFill) {
      if (
        isAfter(date, selection[0]) &&
        cache.remember(`isCheckInDay:${addDays(date, shift).getTime()}`, () =>
          isCheckInDay(addDays(date, shift), blockedPeriods)
        )
      ) {
        return true
      } else if (
        isBefore(date, selection[0]) &&
        cache.remember(`isCheckOutDay:${subDays(date, shift).getTime()}`, () =>
          isCheckOutDay(subDays(date, shift), blockedPeriods)
        )
      ) {
        return true
      }
    }

    const isCheckIn = cache.remember(`isCheckIn:${time}`, () =>
      isCheckInDay(date, blockedPeriods)
    )
    const isCheckOut = cache.remember(`isCheckOut:${time}`, () =>
      isCheckOutDay(date, blockedPeriods)
    )

    if (!selection[0]) {
      if (isCheckOut) {
        return true
      }
    }

    if (days < minDays) {
      return false
    }

    // always allow seletion to connect to check-in & check-out days
    if (isCheckIn != isCheckOut) {
      return true
    }

    if (!selectableWeekday) {
      return false
    }

    for (const blockedPeriod of blockedPeriods) {
      // check if date is in the gap zone before or after a booking and minDays is would be satisfied
      if (
        (isBefore(date, blockedPeriod[0]) &&
          differenceInDays(blockedPeriod[0], date) <= maxGap + shift) ||
        (isAfter(date, blockedPeriod[1]) &&
          differenceInDays(date, blockedPeriod[1]) <= maxGap + shift)
      ) {
        return true
      }
    }

    shift = options.allowOverlap ? 0 : 2

    if (isBefore(date, selection[0])) {
      if (
        overlapsWithPeriods(
          [subDays(period[0], minDays + shift), period[0]],
          blockedPeriods
        )
      ) {
        return false
      }
    }

    if (isAfter(date, selection[0])) {
      if (
        overlapsWithPeriods(
          [period[1], addDays(period[1], minDays + shift)],
          blockedPeriods
        )
      ) {
        return false
      }
    }
  }

  return true
}
