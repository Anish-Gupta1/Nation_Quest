export const GAME_TITLE = "NATION QUEST"

export const WIN_MESSAGES = [
  'Great job!',
  'You found the country!',
  'Geography master!',
  'Explorer success!'
]

export const GAME_COPIED_MESSAGE = 'Game link copied to clipboard'
export const NOT_ENOUGH_LETTERS_MESSAGE = 'Not enough letters'
export const WORD_NOT_FOUND_MESSAGE = 'Country not found'
export const HARD_MODE_ALERT_MESSAGE =
  'Hard Mode can only be enabled at the start!'
export const HARD_MODE_DESCRIPTION =
  'Any revealed hints must be used in subsequent guesses'
export const HIGH_CONTRAST_MODE_DESCRIPTION = 'For improved color visibility'

export const CORRECT_WORD_MESSAGE = (solution: string) =>
  `Nice! The country was ${solution}`

export const WRONG_SPOT_MESSAGE = (guess: string, position: number) =>
  `You must use ${guess} in position ${position}`

export const NOT_CONTAINED_MESSAGE = (letter: string) =>
  `Your guess must contain ${letter}`

export const ENTER_TEXT = 'Enter'
export const DELETE_TEXT = 'Delete'

export const STATISTICS_TITLE = 'Statistics'
export const GUESS_DISTRIBUTION_TEXT = 'Guess Distribution'
export const NEW_WORD_TEXT = 'New country in'
export const SHARE_TEXT = 'Share'
export const TOTAL_TRIES_TEXT = 'Total attempts'
export const SUCCESS_RATE_TEXT = 'Success rate'
export const CURRENT_STREAK_TEXT = 'Current streak'
export const BEST_STREAK_TEXT = 'Best streak'
