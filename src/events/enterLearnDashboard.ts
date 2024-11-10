import type { DuoEnterLearnDashBoardDetail } from './types'
import { LEARN_DASHBOARD_URL } from '../constants'
import { EVENT_DUO_ENTER_LEARN_DASHBOARD, EVENT_DUO_URL_CHANGE } from './constants'

/**
 * Cria um evento personalizado para indicar que o usuário entrou no dashboard de aprendizado.
 */

document.addEventListener(EVENT_DUO_URL_CHANGE, ({ detail }) => {
  if (detail.newUrl === LEARN_DASHBOARD_URL) {
    document.dispatchEvent(createEnterLearnDashboardEvent())
  }
})

export function createEnterLearnDashboardEvent() {
  return new CustomEvent<DuoEnterLearnDashBoardDetail>(EVENT_DUO_ENTER_LEARN_DASHBOARD, {
    detail: undefined,
  })
}
