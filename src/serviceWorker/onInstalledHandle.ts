import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from '../utils/constants'

self.chrome.runtime.onInstalled.addListener(setDefauldSettings)

async function setDefauldSettings() {
  const { settings } = await self.chrome.storage.sync.get(SETTINGS_STORAGE_KEY)

  await self.chrome.storage.sync.set({
    settings: {
      autoFill: settings?.autoFill ?? DEFAULT_SETTINGS.autoFill,
      saveAnswers: settings?.saveAnswers ?? DEFAULT_SETTINGS.saveAnswers,
      saveWrongAnswers: settings?.saveWrongAnswers ?? DEFAULT_SETTINGS.saveWrongAnswers,
    },
  })
}
