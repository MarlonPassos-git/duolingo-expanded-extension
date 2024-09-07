import type { Page } from 'puppeteer'
import { sleep } from 'radashi'

export async function goToFistLesson(page: Page) {
  await page.goto(`https://www.duolingo.com/lesson`)
  await awaitQuitButton(page)
}

export async function closePopup(page: Page) {
  const cssSelector = '[data-test="close-button"]'
  await page.waitForSelector(cssSelector)
  await page.click(cssSelector)
}

export async function awaitQuitButton(page: Page) {
  await page.waitForSelector('[data-test="quit-button"]')
}

export async function startLesson(page: Page) {
  const cssSelector = '[data-test="start-lesson"]'
  await page.waitForSelector(cssSelector)
  await page.click(cssSelector)
}

export async function skipLesson(page: Page) {
  const cssSelector = '[data-test="player-skip"]'
  await page.waitForSelector(cssSelector)
  await page.click(cssSelector)
}

export async function nextLesson(page: Page) {
  const cssSelector = '[data-test="player-next"]'
  await page.waitForSelector(cssSelector)
  await page.click(cssSelector)
}

export async function isListenLesson(page: Page) {
  const cssSelector = '[data-test="player-skip"]'

  return Boolean(await page.$(cssSelector))
}

export async function isSelectTranscription(page: Page) {
  const cssSelector = '[data-test="challenge challenge-selectTranscription"]'

  return Boolean(await page.$(cssSelector))
}

export async function isListenTapLesson(page: Page) {
  const cssSelector = '[data-test="challenge challenge-listenTap"]'

  return Boolean(await page.$(cssSelector))
}

export async function getLessonText(page: Page) {
  const cssSelector = '[data-test="challenge-header"]'

  return await page.$eval(cssSelector, el => el.textContent)
}

export async function selectChoice(page: Page, choiceIndex = 1) {
  const cssSelector = `[data-test="challenge-choice"]:nth-of-type(${choiceIndex})`
  await page.click(cssSelector)
}

export async function typeTextInChallengeInput(page: Page, text: string) {
  const cssSelector = 'textarea'
  await page.waitForSelector(cssSelector)
  await page.type(cssSelector, text)
}

export async function getTypeTextInChallengeInput(page: Page) {
  const cssSelector = 'textarea'
  const a = await page.$eval(cssSelector, el => el.textContent)

  return a ?? ''
}

export type InputMethod = 'wordBank' | 'keyboard'

const map: Record<InputMethod, string> = {
  keyboard: 'Usar banco de palavras',
  wordBank: 'Usar teclado',
}

export async function setPlayerInputMethod(page: Page, inputMethod: InputMethod) {
  const cssSelector = '[data-test="player-toggle-keyboard"]'
  await page.waitForSelector(cssSelector)

  // get the text of the button
  const buttonText = await page.$eval(cssSelector, el => el.textContent)

  if (!buttonText) {
    throw new Error('Could not find button text')
  }

  // verifica se o texto atual e' diferente do que queremos
  if (buttonText !== map[inputMethod]) {
    await page.click(cssSelector)
  }
}

export async function getAudioSrc(page: Page) {
  const audioSrc = await page.$eval('[data-test="challenge challenge-listenTap"]', (node) => {
    const audioNode = node.querySelector('._3qAs-')

    if (!audioNode) {
      return null
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = audioNode?.[Object.keys(audioNode)[0]]?.child?.memoizedProps?.audio

    if (typeof result !== 'string') {
      return null
    }

    return result
  })

  return audioSrc
}
