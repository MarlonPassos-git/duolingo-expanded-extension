import { MessageType } from '../../constants'

export async function getDuolingoAudio() {
  return new Promise<string>((resolve) => {
    chrome.runtime.sendMessage({
      action: MessageType.GET_AUDIO,
    }, function (response) {
      resolve(response)
    })
  })
}
