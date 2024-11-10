import type { DuoUrlChangeDetail } from './types'
import { EVENT_DUO_URL_CHANGE } from './constants'

const root = document.getElementById('root')
let firstActivation = true
let oldHref = document.location.href
console.log('root', root?.ATTRIBUTE_NODE)
if (!root) throw new Error('root not found')

/**
 * Observa mudanças na URL e dispara um evento personalizado.
 * Isso foi necessario pois o evento popstate não é disparado quando a URL muda
 * dentro do SPA do Duolingo.
 */
const urlObserver = new MutationObserver(urlObserverCallback)

urlObserver.observe(root, { childList: true, subtree: true })

function urlObserverCallback() {
  const activeUrl = document.location.href
  console.log('activeUrl', activeUrl)
  if (firstActivation) {
    firstActivation = false
    document.dispatchEvent(createEnterLearnDashboardEvent({ newUrl: oldHref }))
  }

  if (oldHref !== activeUrl) {
    const event = createEnterLearnDashboardEvent({
      newUrl: activeUrl,
      oldUrl: oldHref,
    })
    oldHref = activeUrl

    document.dispatchEvent(event)
  }
}

export function createEnterLearnDashboardEvent(detail: DuoUrlChangeDetail) {
  return new CustomEvent<DuoUrlChangeDetail>(EVENT_DUO_URL_CHANGE, {
    detail,
  })
}
