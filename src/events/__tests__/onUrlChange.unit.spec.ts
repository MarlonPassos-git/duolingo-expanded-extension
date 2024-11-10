import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EVENT_DUO_URL_CHANGE } from '../constants'

describe('onUrlChange', () => {
  let root: HTMLElement
  let oldHref: string

  beforeEach(() => {
    root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
    oldHref = document.location.href
    vi.spyOn(document, 'getElementById').mockReturnValue(root)
  })

  it('should throw an error if root element is not found', () => {
    vi.spyOn(document, 'getElementById').mockReturnValue(null)
    expect(() => require('../onUrlChange')).toThrow('root not found')
  })

  it('should dispatch event on first activation', () => {
    const spy = vi.spyOn(document, 'dispatchEvent')
    require('../onUrlChange')
    expect(spy).toHaveBeenCalledWith(createEnterLearnDashboardEvent({ newUrl: oldHref }))
  })

  it('should dispatch event on URL change', () => {
    require('../onUrlChange')
    const spy = vi.spyOn(document, 'dispatchEvent')
    const newUrl = 'http://new-url.com'
    Object.defineProperty(document, 'location', {
      value: { href: newUrl },
      writable: true,
    })
    root.appendChild(document.createElement('div')) // Trigger mutation
    expect(spy).toHaveBeenCalledWith(createEnterLearnDashboardEvent({ newUrl, oldUrl: oldHref }))
  })

  it('should not dispatch event if URL does not change', () => {
    require('../onUrlChange')
    const spy = vi.spyOn(document, 'dispatchEvent')
    root.appendChild(document.createElement('div')) // Trigger mutation
    expect(spy).toHaveBeenCalledTimes(1) // Only the first activation event
  })
})
