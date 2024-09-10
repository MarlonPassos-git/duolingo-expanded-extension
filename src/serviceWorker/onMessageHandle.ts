/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageType } from '../constants'

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const tabId = sender.tab?.id
  if (!tabId) {
    sendResponse(null)

    return false
  }

  if (msg.action !== MessageType.GET_AUDIO) {
    sendResponse(null)

    return false
  }

  execFuctionInMainWorld(tabId, getAudioSrcFromDuolingoLesson).then((audio) => {
    sendResponse(audio)
  })

  return true
})

/**
 * This function exists to get information from the main world of the tab.
 * CRXJS Extensions by default run in isolated world and can't access the main world.
 *
 * @see https://github.com/crxjs/chrome-extension-tools/issues/695
 */
async function execFuctionInMainWorld<T extends () => any>(tabId: number, func: T) {
  return new Promise<ReturnType<T>>((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        world: 'MAIN',
        injectImmediately: true,
        func,
      },
      (result) => {
        resolve(result?.[0].result)
      },
    )
  })
}

function getAudioSrcFromDuolingoLesson() {
  const element = document.querySelector('._3qAs-')
  if (!element) {
    return undefined
  }
  const key = Object.keys(element).find(_key => _key.startsWith('__reactFiber'))
  if (!key) {
    return undefined
  }
  const audio = element?.[key]?.child?.memoizedProps?.audio

  if (typeof audio !== 'string') {
    return undefined
  }

  return audio
}
