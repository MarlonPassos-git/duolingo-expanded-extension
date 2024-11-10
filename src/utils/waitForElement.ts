type Options = {
  /**
    * Time where a new search will be made in the DOM for the element
    *
    * @default 100
    */
  interval?: number
  /**
    * Maximum time to wait for the element to appear.
    * If the time is reached, the promise will be rejected.
    *
    * @default 120_000
    */
  timeout?: number
}

/**
 * Create a promise that will run every interval checking if the element
 * exists, when it exists it resolves the promise. If the maxTime is reached
 * it will throw an error.
 *
 * Could be used to wait for an element to appear in the DOM.
 *
 * @example
 * ```ts
 * const $element = await waitForElement('button')
 * ```
 */
export function waitForElement<K extends keyof HTMLElementTagNameMap>(selectors: K, options?: Options): Promise<HTMLElementTagNameMap[K]>
export function waitForElement<K extends keyof SVGElementTagNameMap>(selectors: K, options?: Options): Promise<SVGElementTagNameMap[K]>
export function waitForElement<K extends keyof MathMLElementTagNameMap>(selectors: K, options?: Options): Promise<MathMLElementTagNameMap[K]>
export function waitForElement<E extends Element = Element>(selectors: string, options?: Options): Promise<E>
export function waitForElement<E extends Element = Element>(selectors: string, options: Options = {}): Promise<E> {
  const { interval = 100, timeout: maxTime = 120_000 } = options

  return new Promise((resolve, reject) => {
    const _interval = setInterval(() => {
      const $element = document.querySelector<E>(selectors)
      if (!$element) return
      resolve($element)
      clearInterval(_interval)
    }, interval)

    setTimeout(() => {
      clearInterval(interval)
      reject(
        new Error(`Not found element with selector ${selectors} after ${maxTime}ms`),
      )
    }, maxTime)
  })
}
