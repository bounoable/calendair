import { Resolvable, DateOrDateRange } from '@calendair/core'

export interface Options {
  /**
   * Disable all dates / date ranges except the provided ones.
   */
  enabled?: Resolvable<DateOrDateRange[]>

  /**
   * Disable dates / date ranges.
   */
  disabled?: Resolvable<DateOrDateRange[]>

  /**
   * Already blocked periods.
   */
  blocked?: [Date, Date][]

  /**
   * Specify the selectable weekdays. Defaults to all if none provided.
   * Can provide an array of configurations for different periods.
   * 0 = Sunday, 6 = Saturday
   */
  selectableWeekdays?: Array<
    | number
    | {
        period: [Date, Date]
        weekdays: number[]
      }
  >

  /**
   * Minimum days that have to be selected.
   */
  minDays?: number | ((date: Date) => number)

  /**
   * Minimum days that have to be selected.
   */
  maxGap?: number | ((date: Date) => number)

  /**
   * Allow overlapping of two bookings (check-in same as check-out).
   */
  allowOverlap?: boolean

  /**
   * Allow gaps between bookings to be filled, if otherwise the
   * gap could not be filled because of the minDays constraint.
   */
  allowGapFill?: boolean
}
