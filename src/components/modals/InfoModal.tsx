import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="Welcome to Nation Quest!" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Guess the country name in 5 tries. After each guess, the color of the tiles will
        change to show how close your guess was to the correct country.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="I"
          status="correct"
        />
        <Cell value="N" />
        <Cell value="D" />
        <Cell value="I" />
        <Cell value="A" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter I is in the name and in the correct spot.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell value="B" />
        <Cell value="R" />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="A"
          status="present"
        />
        <Cell value="Z" />
        <Cell value="I" />
        <Cell value="L" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter A is in the name but in the wrong spot.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell value="J" />
        <Cell value="A" />
        <Cell value="P" />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="O"
          status="absent"
        />
        <Cell value="N" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter O is not in the country name in any spot.
      </p>

      <p className="mt-6 italic text-sm text-gray-500 dark:text-gray-300">
        Nation Quest is a geography-themed word guessing game inspired by Wordle.
      </p>
    </BaseModal>
  )
}
