import { randomUUID } from 'node:crypto'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { assign, sleep } from 'radashi'
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

  afterEach(async () => {
    await page.close()
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
  })

  it('should persist the text when i make a mistake but saving dirents thing', async () => {
    const answeredResponses = new Map<string, ChecklistItem>()

    let allItensChecked: boolean = false
    await goToFistLesson(page)

    do {
      // click body
      await page.click('body')
      if (await isListenTapLesson(page)) {
        if (isAllAnswered()) {
          allItensChecked = true
          break
        }

        await setPlayerInputMethod(page, 'keyboard')
        const audioSrc = await getAudioSrc(page)
        if (!audioSrc) {
          throw new Error('Could not find audio src')
        }

        if (answeredResponses.has(audioSrc)) {
          const typeText = await getTypeTextInChallengeInput(page)
          expect(answeredResponses.get(audioSrc)?.text).toBe(typeText)
          answeredResponses.set(audioSrc, assign(answeredResponses.get(audioSrc)!, { checked: true }))
          await nextLesson(page)
          await nextLesson(page)
        }
        else {
          const text = randomUUID()
          await typeTextInChallengeInput(page, text)
          answeredResponses.set(audioSrc, {
            checked: false,
            text,
          })
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
    } while (!allItensChecked)

    function isAllAnswered() {
      if (answeredResponses.size === 0) {
        return false
      }

      for (const [, { checked }] of answeredResponses) {
        if (!checked) {
          return false
        }
      }

      return true
    }
  })
})

type ChecklistItem = {
  text: string
  checked: boolean
}
