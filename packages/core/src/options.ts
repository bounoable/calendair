import { Theme } from './theme'
import { Plugin } from './plugin'
import { LocaleOptions } from './locale'
import { CalendarOptions } from './calendar'
import { SelectionOptions } from './selection'

export interface Options extends CalendarOptions, LocaleOptions {
  /**
   * Configure the theme.
   */
  theme?: Theme

  /**
   * Selection options.
   */
  selection?: SelectionOptions

  /**
   * Calendar plugins.
   */
  plugins?: Plugin[]
}
