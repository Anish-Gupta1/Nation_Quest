import { getGuessStatuses } from "../../lib/statuses";
import { Cell } from "./Cell";
import { unicodeSplit } from "../../lib/words";

type Props = {
  guess: string;
  isRevealing?: boolean;
};
const renderPart = (
  char: string,
  i: number,
  letterIndexRef?: { i: number },
  extraProps: any = {}
) => {
  if (char === ' ') {
    return <div key={`space-${i}`} className="w-4" />
  }

  const index = letterIndexRef ? letterIndexRef.i++ : i

  return <Cell key={i} value={char} {...extraProps(index)} />
}

export const CompletedRow = ({ guess, isRevealing }: Props) => {
  const splitGuess = unicodeSplit(guess)
  const statuses = getGuessStatuses(guess.replace(/ /g, ""))

  const letterIndex = { i: 0 }
  
  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((char, i) =>
        renderPart(char, i, letterIndex, (idx: number) => ({
          status: statuses[idx],
          position: idx,
          isRevealing,
          isCompleted: true,
        }))
      )}
    </div>
  )
}
