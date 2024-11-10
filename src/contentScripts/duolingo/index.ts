import { autoFillAnswer } from '../../utils/duolingo/auto-fill'
import { duolingoState } from './duolingoState'
import { SETTINGS_STORAGE_KEY } from '../../constants'
import { throttle } from 'radashi'
import {
  getChallengeInputtedAnswer,
  getTotalDailyLessons,
  parseChallengeNode,
  parseFeedbackNode,
  saveAnswer,
  saveTotalDailyLessons,
  searchExistingAnswer,
} from '../../utils/duolingo'
import type { LessonState, Settings } from '../../utils/interfaces'

const root = document.getElementById('root')

console.debug('Duolingo Memo content script loading...')

if (!root) throw new Error('root not found')

const lessonState: LessonState = {
  onLesson: false,
  currentChallenge: null,
  currentFeedback: null,
}
const clearLessonState = () => {
  lessonState.currentChallenge = null
  lessonState.currentFeedback = null
}
const lessonUrlStringMatch = 'duolingo.com/lesson'

let settings: Settings;

(async () => {
  settings = (await self.chrome.storage.sync.get(SETTINGS_STORAGE_KEY)).settings
})()

self.chrome.storage.sync.onChanged.addListener((changes) => {
  if (changes[SETTINGS_STORAGE_KEY]) {
    settings = changes[SETTINGS_STORAGE_KEY].newValue
  }
})

const saveTotalDailyLessonsThrottled = throttle({ interval: 30_000 }, saveTotalDailyLessons)
const lessonObserverCallback = async () => {
  if (lessonState.currentChallenge !== null && !lessonState.currentChallenge.node.isConnected) {
    lessonState.currentChallenge = null
  }
  if (lessonState.currentFeedback !== null && !lessonState.currentFeedback.node.isConnected) {
    lessonState.currentFeedback = null
  }

  if (lessonState.currentChallenge === null) {
    // Find the challenge node
    const node = document.querySelector('[data-test^="challenge challenge"]')
    if (node) {
      console.group(lessonState.currentChallenge?.type)
      const parsedChallenge = parseChallengeNode(node)
      console.debug(`Challenge node of type ${parsedChallenge.type} found!`)
      lessonState.currentChallenge = parsedChallenge

      if (settings.autoFill) {
        console.debug(
          `Searching for existing answer for challenge: ${parsedChallenge.prompt.toString()}`,
        )
        const answer = await searchExistingAnswer(parsedChallenge)
        if (answer) {
          console.debug(`Found the answer: ${answer}`)
          autoFillAnswer(parsedChallenge, answer)
        }
        else {
          console.debug('No answer found!')
        }
      }
      console.groupEnd()
    }
  }
  else if (lessonState.currentFeedback === null) {
    // Find the feedback node in the mutation
    const node = document.querySelector('[data-test^="blame blame"]')
    if (node) {
      const parsedFeedback = parseFeedbackNode(node)
      if (parsedFeedback.correct) {
        console.debug('Correct answer node found!')
        if (settings.saveAnswers) {
          saveInputtedAnswer(lessonState)
        }
      }
      else {
        console.debug('Incorrect answer node found! ', settings)
        if (settings.saveWrongAnswers) {
          await saveInputtedAnswer(lessonState)
        }
      }
      lessonState.currentFeedback = parsedFeedback
    }
  }

  if (isFinishLessonPage()) {
    const totalDailyLessons = await getTotalDailyLessons()
    saveTotalDailyLessonsThrottled(totalDailyLessons + 1)
  }
}

async function saveInputtedAnswer(_lessonState: NonNullable<LessonState>) {
  const { currentChallenge } = _lessonState
  console.debug('Saving inputted answer...', currentChallenge)

  if (currentChallenge === null) {
    console.error('Cannot save answer without a challenge!')

    return
  }

  const inputtedAnswer = getChallengeInputtedAnswer(currentChallenge)
  if (inputtedAnswer) {
    console.debug(`Saving answer...: ${inputtedAnswer}`)
    await saveAnswer(currentChallenge, inputtedAnswer)
    console.debug('Answer saved!')
  }
  else {
    console.debug('No inputted answer found!')
  }
}

const lessonObserver = new MutationObserver(lessonObserverCallback)

let oldHref = document.location.href

const handleStreakMenuThrottled = throttle({ interval: 1_000 }, handleStreakMenu)
/**
 * Main functionality should only execute when the user is on a lesson page.
 * This is determined by checking if the URL contains the string 'duolingo.com/lesson/'.
 * This cannot be implemented into the manifest.json since the Duolingo web app
 * is a single page application and the page does not reload when navigating.
 * This function observes the URL and checks if the user is on a lesson page.
 *
 * TODO: This may cause performance issues since the observer is always running.
 */
const toggleObservers = async (currentHref: string) => {
  if (currentHref.includes(lessonUrlStringMatch) && !lessonState.onLesson) {
    console.debug('Lesson detected!')
    lessonState.onLesson = true
    clearLessonState()
    lessonObserver.observe(root, { childList: true, subtree: true })
  }
  else if (lessonState.onLesson) {
    console.debug('Lesson ended!')
    lessonState.onLesson = false
    clearLessonState()
    lessonObserver.disconnect()
  }
  handleStreakMenuThrottled()
}
const urlObserverCallback = () => {
  const currentHref = document.location.href
  if (oldHref !== currentHref) {
    oldHref = currentHref
    toggleObservers(currentHref)
  }
}
const urlObserver = new MutationObserver(urlObserverCallback)

urlObserver.observe(root, { childList: true, subtree: true })

// Handle the case where the user navigates to a lesson directly
toggleObservers(document.location.href)

console.debug('Duolingo Memo content script loaded!')

function isFinishLessonPage() {
  const element = document.querySelector('[data-test="session-complete-slide"]')

  return element !== null
}

window.addEventListener('duolingoStateChange', handleStreakMenuThrottled)

async function handleStreakMenu() {
  let $streakMenuClone: HTMLDivElement
  if (document.getElementById('daily-lessons')) {
    $streakMenuClone = document.getElementById('daily-lessons') as HTMLDivElement
  }
  else {
    const $streakMenu = await awaitElement<HTMLDivElement>('[data-test="streak-menu"]')
    $streakMenuClone = $streakMenu.cloneNode(true) as HTMLDivElement
    $streakMenuClone.dataset.test = 'daily-lessons'
    $streakMenuClone.id = 'daily-lessons'

    const $img = $streakMenuClone.querySelector('img')

    if ($img) {
      $img.src = 'https://d35aaqx5ub95lt.cloudfront.net/images/path/icons/53727b0c96103443bc616435bb1f2fbc.svg'
    }

    $streakMenu.insertAdjacentElement('afterend', $streakMenuClone)
  }
  const $streak = $streakMenuClone.querySelector('[data-test="streak-stat"]')
  if ($streak) {
    $streak.textContent = duolingoState.totalDailyLessons.toString()
  }
}

function awaitElement<T extends Element>(selector: string) {
  return new Promise<T>((resolve) => {
    const interval = setInterval(() => {
      const element = document.querySelector<T>(selector)
      if (element) {
        clearInterval(interval)
        resolve(element)
      }
    }, 100)
  })
}
