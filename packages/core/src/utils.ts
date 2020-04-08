import { Ref, isRef, computed } from 'vue'

export type Refable<T> = T | Ref<T> | (() => T)

export function refNormalize<T>(val: T | Ref<T> | (() => T)) {
  if (isRef(val)) {
    return val
  }

  if (typeof val === 'function') {
    return computed(val as () => T)
  }

  return computed(() => val)
}

export function refNormalizeOptions<T extends object>(
  opts?: Partial<T> | Ref<Partial<T>> | (() => Partial<T>),
  def?: T
) {
  const normalized = refNormalize(opts)
  return computed(
    () =>
      ({
        ...def,
        ...normalized.value
      } as T)
  )
}

export type Resolvable<T> = T | (() => T)

export function resolve<T>(val: Resolvable<T>) {
  if (typeof val === 'function') {
    return (val as () => T)()
  }
  return val
}
