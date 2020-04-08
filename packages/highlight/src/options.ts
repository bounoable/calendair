export interface Options {
  /**
   * The highlighted dates.
   */
  highlights?: Date[] | ((date: Date) => boolean)

  /**
   * CSS style of the highlighted dates.
   */
  style?: Partial<CSSStyleDeclaration>
}
