import { MessageType } from '../utils/constants'

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

  execulteScript(tabId).then((audio) => {
    sendResponse(audio)
  })

  return true
})

async function execulteScript(tabId: number): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId! },
        world: 'MAIN',
        injectImmediately: true,
        func: () => {
          const element = document.querySelector('._3qAs-')
          if (!element) {
            return undefined
          }
          const key = Object.keys(element).find(_key => _key.startsWith('__reactFiber'))
          if (!key) {
            return undefined
          }
          const audio = element?.[key]?.child?.memoizedProps?.audio

          return audio
        },
      },
      (result) => {
        if (result && result[0]?.result !== undefined) {
          resolve(result[0].result)
        }
        else {
          reject('No result or undefined audio.')
        }
      },
    )
  })
}
