import { Cell } from './Cell'
import { solution, unicodeSplit } from "../../lib/words"


type Props = {
  guess: string
  className: string
}

export const CurrentRow = ({ guess, className }: Props) => {
  const solutionChars = unicodeSplit(solution)     // <-- use solution layout
  const guessChars = unicodeSplit(guess)

  let guessIndex = 0

  const classes = `flex justify-center mb-1 ${className}`

  return (
    <div className={classes}>
      {solutionChars.map((char, i) => {
        if (char === " ") {
          return <div key={`space-${i}`} className="w-4" />
        }

        const value = guessChars[guessIndex] ?? ""
        guessIndex++

        return <Cell key={i} value={value} />
      })}
    </div>
  )
}

