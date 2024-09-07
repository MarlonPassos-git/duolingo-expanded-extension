import { sleep } from 'radashi'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { Browser, Page } from 'puppeteer'
import { getAudioSrc, getTypeTextInChallengeInput, goToFistLesson, isListenTapLesson, isSelectTranscription, nextLesson, selectChoice, setPlayerInputMethod, skipLesson, typeTextInChallengeInput } from './utils/duolingo'
import { getBrowser, setCookies } from './utils/puppetier'

describe('Auto Complete Listen Tap', () => {
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    browser = await getBrowser()
  })

  afterAll(async () => {
    await browser.close()
  })

  beforeEach(async () => {
    page = await browser.newPage()
    await setCookies(page)
  })

  it('Should persist the sound when i make a mistake', async () => {
    const answeredResponses = new Map<string, string>()
    let find = false
    await goToFistLesson(page)

    do {
      // click body
      await page.click('body')
      if (await isListenTapLesson(page)) {
        await setPlayerInputMethod(page, 'keyboard')
        const audioSrc = await getAudioSrc(page)

        if (!audioSrc) {
          throw new Error('Could not find audio src')
        }

        if (answeredResponses.has(audioSrc)) {
          const typeText = await getTypeTextInChallengeInput(page)
          expect(answeredResponses.get(audioSrc)).toBe(typeText)
          find = true
        // sleep(10000000)
        }
        else {
          const text = 'hello'
          await typeTextInChallengeInput(page, text)
          answeredResponses.set(audioSrc, text)
          await nextLesson(page)
          await nextLesson(page)
        }

        await sleep(1000)
      }
      else if (await isSelectTranscription(page)) {
        await selectChoice(page)
        await nextLesson(page)
        await nextLesson(page)
      }
      else {
        await skipLesson(page)
        await nextLesson(page)
      }
      await sleep(200)
    } while (!find)

    expect('hello').toBe('hello')
  })
})
