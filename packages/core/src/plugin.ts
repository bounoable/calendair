import { useCalendar } from './calendar'
import { useRendering } from './rendering'
import { useSelection } from './selection'
import { useTheme } from './theme'

export type Plugin = (ctx: InstallContext) => any

export interface InstallContext {
  calendar: ReturnType<typeof useCalendar>
  rendering: ReturnType<typeof useRendering>
  selection: ReturnType<typeof useSelection>
  theme: ReturnType<typeof useTheme>
}
