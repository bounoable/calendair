import { addMonths, startOfDay } from 'date-fns/esm'

export interface Period {
  start: Date
  end: Date
}

export function shiftPeriod(period: Period, months: number): Period {
  return {
    start: addMonths(period.start, months),
    end: addMonths(period.end, months)
  }
}

export function periodKey(period: Period) {
  return `${period.start.getFullYear()}-${period.start.getMonth()}-${period.start.getDate()}_${period.end.getFullYear()}-${period.end.getMonth()}-${period.end.getDate()}`
}

export type DateOrDateRange = Date | [Date, Date]

export function normalizeDateOrDateRanges(
  dates: DateOrDateRange[]
): DateOrDateRange[] {
  return dates.map(date => {
    if (date instanceof Date) {
      return startOfDay(date)
    }
    return [startOfDay(date[0]), startOfDay(date[1])]
  })
}
