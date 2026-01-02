import { solution } from '../lib/words'

export const MAX_CHALLENGES = 5
export const ALERT_TIME_MS = 2000
export const REVEAL_TIME_MS = 200
export const WELCOME_INFO_MODAL_MS = 350

export const getMaxWordLength = () => solution.length

export const getGameLostInfoDelay = () => (getMaxWordLength() + 1) * REVEAL_TIME_MS
