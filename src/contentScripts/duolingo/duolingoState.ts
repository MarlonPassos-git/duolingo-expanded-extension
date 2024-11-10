import type { DuolingoState } from '../../utils/interfaces'
import { getDayKey, getTotalDailyLessons } from '../../utils/duolingo/storage'
import { isBoolean, isNumber, isString } from 'radashi'

const stateHandler: ProxyHandler<DuolingoState> = {
  set(target, property, value) {
    console.log(`Setting ${property as any} to ${value}`)
    if (!isString(property)) return false

    switch (property) {
      case 'totalDailyLessons':
        if (!isNumber(value)) {
          console.error('The totalDailyLessons property must be a number')

          return false
        }

        if (value < 0) {
          console.error('The totalDailyLessons property must be a positive number')

          return false
        }
        target[property] = value
        break
      case 'isLoaded':
        if (!isBoolean(value)) {
          console.error('The isLoaded property must be a boolean')

          return false
        }
        target[property] = value
        break
      default:
        return false
    }

    const event = new CustomEvent('duolingoStateChange', { detail: { state: target } })
    window.dispatchEvent(event)

    return true
  },
}
const initialState: DuolingoState = {
  isLoaded: false,
  totalDailyLessons: 0,
}
export const duolingoState = new Proxy<DuolingoState>(initialState, stateHandler);

(async () => {
  duolingoState.totalDailyLessons = await getTotalDailyLessons()
  duolingoState.isLoaded = true
})()

self.chrome.storage.local.onChanged.addListener(async (changes) => {
  if (changes[getDayKey()]) {
    duolingoState.totalDailyLessons = changes[getDayKey()].newValue
  }
})
