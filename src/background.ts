import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from './utils/constants'

self.chrome.runtime.onInstalled.addListener(async () => {
  console.debug('Installed! DEBUG')
  const { settings } = await self.chrome.storage.sync.get(SETTINGS_STORAGE_KEY)
  if (settings) {
    console.debug('Found previous settings:', JSON.stringify(settings))
  }
  else {
    console.debug('No previous settings found, setting defaults.')
  }
  await self.chrome.storage.sync.set({
    settings: {
      autoFill: settings?.autoFill ?? DEFAULT_SETTINGS.autoFill,
      saveAnswers: settings?.saveAnswers ?? DEFAULT_SETTINGS.saveAnswers,
      saveWrongAnswers: settings?.saveWrongAnswers ?? DEFAULT_SETTINGS.saveWrongAnswers,
    },
  })
})

console.debug('Background script loaded!')
