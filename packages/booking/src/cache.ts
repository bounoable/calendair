import { Ref, watch, ref } from 'vue'
import { Options } from './options'

export interface Cache {
  remember<T>(key: string, fn: () => T): T
  forget(key: string): void
  clear(): void
  get<T extends any>(key: string): T | undefined
}

export function useCache(options: Ref<Options>): Cache {
  const cache = ref<{ [key: string]: any }>({})
  watch(options, () => (cache.value = {}))

  const remember = <T>(key: string, fn: () => T): T => {
    if (typeof cache.value[key] !== 'undefined') {
      return cache.value[key]
    }

    cache.value[key] = fn()

    return get(key)!
  }

  const forget = (key: string) => delete cache.value[key]
  const clear = () => (cache.value = {})
  const get = <T extends any = any>(key: string) =>
    cache.value[key] as T | undefined

  return {
    remember,
    forget,
    clear,
    get,
  }
}
