import {
  Plugin,
  Refable,
  InstallContext,
  refNormalizeOptions
} from '@calendair/core'
import { Options } from './options'
import { Ref, computed } from 'vue'
import { startOfDay } from 'date-fns/esm'

export default function HighlightPlugin(options?: Refable<Options>) {
  const opts = computed(() => {
    const normalized = refNormalizeOptions(options, {
      style: {
        zIndex: '1',
        borderColor: '#9ae6b4',
        backgroundColor: '#f0fff4'
      }
    } as Options)

    return {
      ...normalized.value,
      highlights:
        normalized.value.highlights &&
        typeof normalized.value.highlights !== 'function'
          ? normalized.value.highlights.map(startOfDay)
          : normalized.value.highlights
    }
  })

  const plugin: Plugin = ctx => {
    patchTheme(ctx, opts)
  }

  return plugin
}

function patchTheme(ctx: InstallContext, options: Ref<Options>) {
  ctx.theme.cellStyleInterceptors.value.push((day, state, prev) => {
    if (
      state.hovered ||
      state.inSelection ||
      state.inShadowSelection ||
      state.selected ||
      !state.currentMonth
    ) {
      return prev
    }

    if (!isHighlighted(day.date, options.value)) {
      return prev
    }

    return {
      ...prev,
      ...options.value.style
    }
  })
}

function isHighlighted(date: Date, options: Options) {
  if (!options.highlights) {
    return false
  }

  if (typeof options.highlights === 'function') {
    return options.highlights(date)
  }

  return !!options.highlights.find(h => h.getTime() === date.getTime())
}
