import { sleep } from 'radashi'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('onUrlChange', () => {
  function createRoot() {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
  }

  function clearDocumentBody() {
    document.body.innerHTML = ''
  }

  async function appendRandomDivs() {
    const $root = document.querySelector('#root')

    if (!$root) return
    $root.appendChild(document.createElement('div'))
    $root.appendChild(document.createElement('div'))
    await sleep(0)
  }

  beforeEach(createRoot)
  afterEach(clearDocumentBody)

  it('should throw an error if root element is not found', async () => {
    clearDocumentBody()
    await expect(async () => await import(`../onUrlChange?version=0`)).rejects.toThrow('root not found')
  })

  it('should dispatch event on first mutation in the same url', async () => {
    const callBack = vi.fn()
    document.addEventListener('DUO_URL_CHANGE', callBack)
    await import('../onUrlChange?version=1')
    await appendRandomDivs()
    expect(callBack).toHaveBeenCalled()
    expect(callBack).toBeCalledTimes(1)
  })

  it('should dispatch event only once if DOM changes multiple times but URL remains the same', async () => {
    createRoot()
    const callBack = vi.fn()
    document.addEventListener('DUO_URL_CHANGE', callBack)
    await import('../onUrlChange.ts?a=2')

    expect(callBack).toBeCalledTimes(0)
    await appendRandomDivs()
    expect(callBack).toBeCalledTimes(1)
    await appendRandomDivs()
    expect(callBack).toBeCalledTimes(1)
  })

  it('should dispatch event on URL change', async () => {
    const callBack = vi.fn()
    document.addEventListener('DUO_URL_CHANGE', callBack)
    await import('../onUrlChange.ts?version=3')
    await appendRandomDivs()
    const url = new URL(document.URL)
    url.pathname = 'learn'

    window.history.pushState({}, '', url.toString())
    await appendRandomDivs()
    expect(callBack).toBeCalledTimes(2)
    expect(callBack).toHaveBeenNthCalledWith(1, expect.objectContaining({
      detail: { newUrl: `http://localhost:3000/` },
    }))
    expect(callBack).toHaveBeenNthCalledWith(2, expect.objectContaining({
      detail: { newUrl: `http://localhost:3000/learn`, oldUrl: 'http://localhost:3000/' },
    }))
  })
})
