import type { Browser } from 'puppeteer'
import puppeteerNode from 'puppeteer'
import { EXTENSION_PATH } from './constants'
import type { Page } from 'puppeteer'
import { getEnv } from './env'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import fs from 'node:fs'
import { mkdtemp } from 'node:fs/promises'
import { deleteFileOrDir } from './fs'

let browser: Browser | null
const cookies = [
  {
    name: 'jwt_token',
    value: getEnv().DUOLINGO_JWT_TOKEN,
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
  console.log('tempUserDataDir', tempUserDataDir)
  const _browser = await puppeteerNode.launch({
    executablePath: getEnv().CHROME_PATH,
    headless: getEnv().HEADLESS,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--mute-audio',
      '--no-sandbox',
      `--user-data-dir=${tempUserDataDir}`,
    ],
    defaultViewport: {
      width: 1920,
      height: 980,
    },
  })

  _browser.on('disconnected', async () => {
    deleteFileOrDir(tempUserDataDir, true)
    console.log('Browser disconnected')
    browser = null
  })

  return _browser
}
