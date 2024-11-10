import type { Browser } from 'puppeteer'
import { deleteFileOrDir } from './fs'
import { EXTENSION_PATH } from './constants'
import { getEnv } from './env'
import { join } from 'node:path'
import { mkdtemp } from 'node:fs/promises'
import type { Page } from 'puppeteer'
import puppeteerNode from 'puppeteer'
import { tmpdir } from 'node:os'

let browser: Browser | null
const cookies = [
  {
    name: 'jwt_token',
    value: getEnv().VITE_DUOLINGO_JWT_TOKEN,
    domain: '.duolingo.com',
  }]

export function setCookies(page: Page) {
  return page.setCookie(...cookies)
}

export async function getBrowser() {
  if (!browser) {
    browser = await createBrowser()
  }

  return browser
}

async function createBrowser() {
  const tempUserDataDir = await mkdtemp(join(tmpdir(), 'puppeteer-'))
  const _browser = await puppeteerNode.launch({
    executablePath: getEnv().VITE_CHROME_PATH,
    headless: getEnv().VITE_HEADLESS,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--mute-audio',
      '--no-sandbox',
      `--user-data-dir=${tempUserDataDir}`,
    ],
    defaultViewport: {
      width: 1720,
      height: 780,
    },
  })

  _browser.on('disconnected', async () => {
    deleteFileOrDir(tempUserDataDir, true)
    browser = null
  })

  return _browser
}
