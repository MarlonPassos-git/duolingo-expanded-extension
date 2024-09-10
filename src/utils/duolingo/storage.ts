import browser from 'webextension-polyfill'
import { ChallengeType, HASH_ALGORITH } from '../../constants'
import type { Challenge } from '../interfaces'
import { isChallengeSupported } from './functions'
import { isString, sleep } from 'radashi'
import { getDuolingoAudio } from './getAudio'

/**
 * Searches an answer to a challenge in the extension storage.
 *
 * @param challenge Searches for an existing answer for the provided challenge
 * @returns The answer if found, null otherwise
 */
export const searchExistingAnswer = async (challenge: Challenge): Promise<string | null> => {
  if (!isChallengeSupported(challenge)) {
    console.debug('Unsupported challenge type. Cannot search for existing answer.')

    return null
  }

  const key = await getAnswerKey(challenge)
  const result = await browser.storage.local.get(key)

  console.debug({ key, result, challenge: challenge.type })

  return result[key] ?? null
}

/**
 * Saves an answer to a challenge in the extension storage.
 *
 * @param challenge Searches for an existing answer for the provided challenge
 * @param answer The answer to save
 */
export const saveAnswer = async (
  challenge: Challenge,
  answer: string | string[],
): Promise<void> => {
  if (!isChallengeSupported(challenge)) {
    console.debug('Unsupported challenge type. Will not save answer.')

    return
  }

  const key = await getAnswerKey(challenge)
  await browser.storage.local.set({ [key]: answer })
}

export function getDayKey() {
  const day = new Date()

  return day.getDate() + '/' + (day.getMonth() + 1) + '/' + day.getFullYear()
}

export async function saveTotalDailyLessons(totalDailyLessons: number) {
  await browser.storage.local.set({
    [getDayKey()]: totalDailyLessons,
  })
}

export async function getTotalDailyLessons() {
  const result = await browser.storage.local.get(getDayKey())
  const n = result[getDayKey()]

  if (isNaN(n)) {
    return 0
  }

  return Number(n)
}

function removeSymbols(str: string) {
  // Usamos uma expressão regular para manter apenas letras e números
  return str.replace(/[^\w\s]/gi, '')
}

/**
 * Forms the key corresponding to the answer of the provided challenge
 *
 * @param challenge The challenge object
 * @returns The key used to store the answer
 */
const getAnswerKey = async (challenge: Challenge): Promise<string> => {
  const { prompt } = challenge
  const { type } = challenge

  if (type === ChallengeType.TRANSLATE) {
    // await awaitCallback(() => getAudioSrc(node) !== null)
    const src = await getDuolingoAudio()
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa', src)
    if (isString(src)) {
      // const a = await cryptoArray([src], type)

      return removeSymbols(src)
    }
  }

  return Array.prototype.map
    .call(
      new Uint8Array(
        await window.crypto.subtle.digest(
          HASH_ALGORITH,
          new TextEncoder().encode(`${type}///${prompt.toString()}`),
        ),
      ),
      x => ('00' + x.toString(16)).slice(-2),
    )
    .join('')
}

async function cryptoArray(array: string[], type: ChallengeType) {
  return Array.prototype.map
    .call(
      new Uint8Array(
        await window.crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(`${type}///${array.toString()}`),
        ),
      ),
      x => ('00' + x.toString(16)).slice(-2),
    )
    .join('')
}

function awaitCallback(callback: () => boolean, retryInterval = 100, timeout = 5000) {
  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      if (callback()) {
        clearInterval(interval)
        resolve()
      }
      if (Date.now() - startTime > timeout) {
        clearInterval(interval)
        reject(new Error('Timeout'))
      }
    }, retryInterval)
  })
}

function FindReact(dom, traverseUp = 0) {
  const key = Object.keys(dom).find((key) => {
    return key.startsWith('__reactFiber$') // react 17+
      || key.startsWith('__reactInternalInstance$') // react <17
  })
  const domFiber = dom[key]
  if (domFiber == null) return null

  // react <16
  if (domFiber._currentElement) {
    let compFiber = domFiber._currentElement._owner
    for (let i = 0; i < traverseUp; i++) {
      compFiber = compFiber._currentElement._owner
    }

    return compFiber._instance
  }

  // react 16+
  const GetCompFiber = (fiber) => {
    // return fiber._debugOwner; // this also works, but is __DEV__ only
    let parentFiber = fiber.return
    while (typeof parentFiber.type == 'string') {
      parentFiber = parentFiber.return
    }

    return parentFiber
  }
  let compFiber = GetCompFiber(domFiber)
  for (let i = 0; i < traverseUp; i++) {
    compFiber = GetCompFiber(compFiber)
  }

  let reactElement = null

  if (compFiber.props != null) {
    reactElement = compFiber
  }
  if (compFiber.memoizedProps != null) {
    compFiber.props = compFiber.memoizedProps
    reactElement = compFiber
  }

  if (compFiber.props == null && compFiber.memoizedProps == null) {
    reactElement = compFiber.stateNode
  }

  return reactElement
}
