import type { EVENT_DUO_ENTER_LEARN_DASHBOARD, EVENT_DUO_LESON_END, EVENT_DUO_LESON_START } from './constants'

export interface DuoLessonStartDetail {
  startTime: Date
}

// Define os detalhes do evento DUO_LESON_END
export interface DuoLessonEndDetail {
  endTime: Date
}

/** @see https://prnt.sc/f-GvvonXjXbW */
export interface DuoEnterLearnDashBoardDetail {}

// Mapeia o nome dos eventos para os detalhes corretos
export interface CustomEventMap {
  [EVENT_DUO_LESON_START]: CustomEvent<DuoLessonStartDetail>
  [EVENT_DUO_LESON_END]: CustomEvent<DuoLessonEndDetail>
  [EVENT_DUO_ENTER_LEARN_DASHBOARD]: CustomEvent<DuoEnterLearnDashBoardDetail>
}

// Extendendo a interface de eventos do window
