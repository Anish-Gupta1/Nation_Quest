import { useEffect, useState } from 'react'
import { BaseModal } from './BaseModal'
import { useAlert } from '../../context/AlertContext'

type Props = {
  isOpen: boolean
  handleClose: () => void
  onSelectLevel?: (level: string, timeLimitSeconds?: number) => void
  onLevelTimeout?: (level: string) => void
}

const LEVELS = [
  {
    id: 'map-learner',
    title: 'Map Learner',
    description: 'No time limit — learn at your own pace.',
  },
  {
    id: 'geo-scholar',
    title: 'Geo Scholar',
    seconds: 120,
    description: '2-minute timer — balanced challenge.',
  },
  {
    id: 'nation-sage',
    title: 'Nation Sage',
    seconds: 45,
    description: '45-second timer — fast & intense.',
  },
]

export const LevelModal = ({ isOpen, handleClose, onSelectLevel, onLevelTimeout }: Props) => {
  const { showError: showErrorAlert } = useAlert()
  const [selected, setSelected] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setSelected(null)
      setTimeLeft(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (timeLeft === null) return
    if (timeLeft <= 0) {
      const lvl = selected || ''
      showErrorAlert("Time's up — level failed.")
      onLevelTimeout?.(lvl)
      handleClose()
      return
    }

    const id = setInterval(() => setTimeLeft(t => (t !== null ? t - 1 : t)), 1000)
    return () => clearInterval(id)
  }, [timeLeft, selected, handleClose, onLevelTimeout, showErrorAlert])

  const startLevel = (levelId: string) => {
    const def = LEVELS.find(l => l.id === levelId)!
    setSelected(levelId)
    if (def.seconds) setTimeLeft(def.seconds)
    onSelectLevel?.(def.title, def.seconds)
    handleClose()
  }

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
    const ss = s % 60
    return `${mm}:${ss.toString().padStart(2, '0')}`
  }

  return (
    <BaseModal title="Choose a Level" isOpen={isOpen} handleClose={handleClose}>
      <div className="space-y-4">

        {LEVELS.map(lvl => (
          <button
            key={lvl.id}
            onClick={() => startLevel(lvl.id)}
            className="
              w-full text-left p-4 rounded-xl border 
              bg-white dark:bg-zinc-800
              hover:bg-zinc-50 dark:hover:bg-zinc-700
              border-zinc-200 dark:border-zinc-700
              shadow-sm hover:shadow-md transition-all
              flex items-center justify-between
            "
          >
            <div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                {lvl.title}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-300">
                {lvl.description}
              </div>
            </div>
          </button>
        ))}

        {timeLeft !== null && (
          <div className="mt-3 text-center text-sm font-medium 
            text-red-600 dark:text-red-400">
            ⏳ Time left: {formatTime(timeLeft)}
          </div>
        )}
      </div>
    </BaseModal>
  )
}

export default LevelModal
