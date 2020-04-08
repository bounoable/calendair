import {
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format as dateFnsFormat
} from 'date-fns/esm'
import { Locale } from 'date-fns'
import dateFnsEnUs from 'date-fns/esm/locale/en-US'
import { Refable, refNormalizeOptions } from './utils'
import { computed } from 'vue'

export interface ReadyLocaleOptions {
  /**
   * date-fns locale.
   */
  locale: Locale

  /**
   * Character length of the abbreviated weekdays.
   */
  shortWeekdaysLength: number
}

export type LocaleOptions = Partial<ReadyLocaleOptions>

const defaultLocaleOptions: ReadyLocaleOptions = {
  locale: dateFnsEnUs,
  shortWeekdaysLength: 3
}

const now = new Date()

export function useLocale(options?: Refable<LocaleOptions>) {
  const opts = refNormalizeOptions(options, defaultLocaleOptions)
  const locale = computed(() => opts.value.locale)

  const weekdays = eachDayOfInterval({
    start: startOfWeek(now),
    end: endOfWeek(now)
  }).map(d => opts.value.locale.localize?.day(d.getDay()) || '')

  const weekdaysShort = weekdays.map(name =>
    name.substr(0, opts.value.shortWeekdaysLength)
  )

  const formatDate = (
    date: Date,
    format: string,
    options: Parameters<typeof dateFnsFormat>[2]
  ) =>
    dateFnsFormat(date, format, {
      locale: opts.value.locale,
      ...options
    })

  return {
    locale,
    weekdays,
    weekdaysShort,
    formatDate
  }
}
