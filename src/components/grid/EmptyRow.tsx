// import { getMaxWordLength } from '../../constants/settings'
import { Cell } from './Cell'
import { solution, unicodeSplit } from "../../lib/words"


export const EmptyRow = () => {
  const solutionChars = unicodeSplit(solution)

  return (
    <div className="flex justify-center mb-1">
      {solutionChars.map((char, i) =>
        char === " "
          ? <div key={`space-${i}`} className="w-4" />
          : <Cell key={i} />
      )}
    </div>
  )
}
