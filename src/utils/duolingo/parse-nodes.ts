import { ChallengeType, UNKNOWN_CHALLENGE_HEADER } from '../constants';
import type { Challenge, Feedback, TranslateChallenge } from '../interfaces';
import { isChallengeSupported } from './functions';

const challengeTypeRegex = /^challenge challenge-(\w+)$/;
const feedbackCorrectnessRegex = /^blame blame-(\w+)$/;

const parseTranslateChallenge = (node: Element): TranslateChallenge => {
  const answerArea = node.querySelector(
    '[data-test="challenge-translate-input"]',
  ) as HTMLTextAreaElement;
  return {
    node,
    type: ChallengeType.TRANSLATE,
    header: getChallengeHeader(node),
    prompt: getChallengePrompt(node),
    answerArea,
  };
};

/**
 * Scraps information about the challenge provided the parent node.
 *
 * @param node The parent node of the challenge
 * @returns An object representing the challenge
 */
export const parseChallengeNode = (node: Element): Challenge => {
  const dataTest = node.attributes.getNamedItem('data-test')?.value;
  const type = (dataTest?.match(challengeTypeRegex)?.[1] ?? ChallengeType.UNKNOWN) as ChallengeType;
  if (type === ChallengeType.TRANSLATE) {
    return parseTranslateChallenge(node);
  }
  return {
    node,
    type,
    header: getChallengeHeader(node),
    prompt: getChallengePrompt(node),
  };
};

/**
 * Scraps information about the feedback (answer result) provided the parent node.
 *
 * @param node The parent node of the feedback
 * @returns An object representing the feedback
 */
export const parseFeedbackNode = (node: Element): Feedback => {
  const dataTest = node.attributes.getNamedItem('data-test')?.value;
  const blame = dataTest?.match(feedbackCorrectnessRegex)?.[1];
  return {
    node,
    correct: blame === 'correct',
  };
};

/**
 * Scraps the challenge header provided the parent node.
 *
 * @param node The parent node of the challenge
 * @returns The challenge header
 */
const getChallengeHeader = (node: Element): string => {
  return (
    node.querySelector('[data-test="challenge-header"]')?.textContent ?? UNKNOWN_CHALLENGE_HEADER
  );
};

/**
 * Scraps the challenge prompt provided the parent node.
 *
 * @param node The parent node of the challenge
 * @returns The challenge prompt
 */
const getChallengePrompt = (node: Element): string[] => {
  const uniqueParents = Array.from(node.querySelectorAll('[data-test="hint-token"]'))
    .map((el) => el.parentElement?.parentElement)
    .filter((el, i, arr) => arr.indexOf(el) === i && el !== null && el !== undefined) as Element[];

  return uniqueParents.map((parent) =>
    Array.from(parent.children).reduce(
      (el, child) => (child.tagName === 'SPAN' ? el + child.textContent : el + 'X'),
      '',
    ),
  );
};

const getTranslateChallengeInputtedAnswer = (challenge: TranslateChallenge): string => {
  return challenge.answerArea.value;
};

/**
 * Retrieves the user-inputted answer to the challenge.
 *
 * @param challenge Challenge to get inputted answer from
 * @returns The inputted answer to the challenge
 */
export const getChallengeInputtedAnswer = (challenge: Challenge): string | null => {
  if (!isChallengeSupported(challenge)) {
    console.log('Unsupported challenge type. Will not parse inputted answer.');
    return null;
  }

  if (challenge.type === ChallengeType.TRANSLATE) {
    return getTranslateChallengeInputtedAnswer(challenge as TranslateChallenge);
  }

  return null;
};