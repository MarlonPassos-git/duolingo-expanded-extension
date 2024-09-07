import puppeteerNode, { Browser } from "puppeteer"
import { EXTENSION_PATH } from "./constants";
import { Page } from "puppeteer";
import { getEnv } from "./env"

let browser: Browser | null
const cookies = [
    {
      name: 'jwt_token',
      value: getEnv().DUOLINGO_JWT_TOKEN,
      domain: '.duolingo.com'
    }]

export function setCookies(page: Page) {
    return page.setCookie(...cookies);
}

export async function getBrowser() {
    if (!browser) {
        browser = await createBrowser();
    }

  return browser
}

async function createBrowser() {
    const _browser = await puppeteerNode.launch({
    headless: true,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--mute-audio'
    ],
    defaultViewport: {
      width: 1920,
      height: 980,
    },
  });
    // const _browser = await puppeteerNode.connect({
    //     browserWSEndpoint: 'ws://localhost:3000?token=a',
    // })

  _browser.on('disconnected', () => {
    browser = null;
  })

  return _browser;
}