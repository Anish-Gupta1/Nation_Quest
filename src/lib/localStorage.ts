const gameStateKey = 'gameState'
const highContrastKey = 'highContrast'

type StoredGameState = {
  guesses: string[]
  solution: string
}

// --- GAME STATE (clears when tab closes, survives refresh) ---
export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  sessionStorage.setItem(gameStateKey, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = () => {
  const state = sessionStorage.getItem(gameStateKey)
  return state ? (JSON.parse(state) as StoredGameState) : null
}

// --- GAME STATS (also tab-scoped, optional — change to sessionStorage too) ---
const gameStatKey = 'gameStats'

export type GameStats = {
  winDistribution: number[]
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
}

export const saveStatsToLocalStorage = (gameStats: GameStats) => {
  sessionStorage.setItem(gameStatKey, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = () => {
  const stats = sessionStorage.getItem(gameStatKey)
  return stats ? (JSON.parse(stats) as GameStats) : null
}

// --- SETTINGS (should persist forever, so keep localStorage) ---
export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, '1')
  } else {
    localStorage.removeItem(highContrastKey)
  }
}

export const getStoredIsHighContrastMode = () => {
  const highContrast = localStorage.getItem(highContrastKey)
  return highContrast === '1'
}
