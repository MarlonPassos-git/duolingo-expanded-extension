import browser from 'webextension-polyfill';
import { ChallengeType, HASH_ALGORITH } from '../constants';
import type { Challenge } from '../interfaces';
import { isChallengeSupported } from './functions';
import { isString } from 'radashi';

/**
 * Searches an answer to a challenge in the extension storage.
 *
 * @param challenge Searches for an existing answer for the provided challenge
 * @returns The answer if found, null otherwise
 */
export const searchExistingAnswer = async (challenge: Challenge): Promise<string | null> => {
  if (!isChallengeSupported(challenge)) {
    console.debug('Unsupported challenge type. Cannot search for existing answer.');
    return null;
  }

  const key = await getAnswerKey(challenge);
  const result = await browser.storage.local.get(key);

  console.debug({ key, result });

  return result[key] ?? null;
};

/**
 * Saves an answer to a challenge in the extension storage.
 *
 * @param challenge Searches for an existing answer for the provided challenge
 * @param answer The answer to save
 */
export const saveAnswer = async (
  challenge: Challenge,
  answer: string | string[],
): Promise<void> => {
  if (!isChallengeSupported(challenge)) {
    console.debug('Unsupported challenge type. Will not save answer.');
    return;
  }

  const key = await getAnswerKey(challenge);
  await browser.storage.local.set({ [key]: answer });
};

export function getDayKey() {
  const day = new Date();
  return day.getDate() + '/' + (day.getMonth() + 1) + '/' + day.getFullYear();
}

export async function saveTotalDailyLessons(totalDailyLessons: number) {
  await browser.storage.local.set({ 
    [getDayKey()]: totalDailyLessons
   });
}

export async function getTotalDailyLessons() {
  const result = await browser.storage.local.get(getDayKey());
  const n = result[getDayKey()];

  if (isNaN(n)) {
    return 0;
  }

  return Number(n);
}

/**
 * Forms the key corresponding to the answer of the provided challenge
 *
 * @param challenge The challenge object
 * @returns The key used to store the answer
 */
const getAnswerKey = async (challenge: Challenge): Promise<string> => {
  let {  prompt } = challenge;
  const { type, node } = challenge;

  if (type === ChallengeType.LISTEN) {
    const src = getAudioSrc(node);

    console.log("marlon",src);

    if (isString(src)) {
      prompt = [src]
    }
  }

  return Array.prototype.map
    .call(
      new Uint8Array(
        await window.crypto.subtle.digest(
          HASH_ALGORITH,
          new TextEncoder().encode(`${type}///${prompt.toString()}`),
        ),
      ),
      (x) => ('00' + x.toString(16)).slice(-2),
    )
    .join('');
};


function getAudioSrc(node: Element): string| null {
  const selector = '._3qAs-';

  const audioNode = node.querySelector(selector);

  if (!audioNode) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result =  audioNode?.[Object.keys(audioNode)[0]]?.child?.memoizedProps?.audio  

  if (!isString(result)) {
    return null;
  }

  return result;
}