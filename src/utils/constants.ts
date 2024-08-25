import { Settings } from "./interfaces";

export const UNKNOWN_CHALLENGE_TYPE = 'UNKNOWN_CHALLENGE_TYPE';
export const UNKNOWN_CHALLENGE_HEADER = 'UNKNOWN_CHALLENGE_HEADER';

export const HASH_ALGORITH = 'SHA-256';

export const SETTINGS_STORAGE_KEY = 'settings';

export enum ChallengeType {
  TAP_COMPLETE = 'tapComplete',
  TRANSLATE = 'translate',
  TRANSLATE_TAP = 'translate-tap',
  ASSIST = 'assist',
  DIALOGUE = 'dialogue',
  COMPLETE_REVERSE_TRANSLATION = 'completeReverseTranslation',
  LISTEN_COMPLETE = 'listenComplete',
  LISTEN = 'listen',
  SPEAK = 'speak',
  UNKNOWN = UNKNOWN_CHALLENGE_TYPE,
}

export const DEFAULT_SETTINGS: Settings = {
  autoFill: true,
  saveAnswers: true,
  saveWrongAnswers: true,
};

export const supportedChallenges: ChallengeType[] = [
  ChallengeType.TRANSLATE,
  ChallengeType.TRANSLATE_TAP,
  ChallengeType.TAP_COMPLETE,
  ChallengeType.ASSIST,
  ChallengeType.LISTEN,
];
