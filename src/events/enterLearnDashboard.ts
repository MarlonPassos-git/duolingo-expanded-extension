import type { DuoEnterLearnDashBoardDetail } from './types'
import { EVENT_DUO_ENTER_LEARN_DASHBOARD } from './constants'

export function createEnterLearnDashboardEvent() {
  return new CustomEvent<DuoEnterLearnDashBoardDetail>(EVENT_DUO_ENTER_LEARN_DASHBOARD, {
    detail: undefined,
  })
}
