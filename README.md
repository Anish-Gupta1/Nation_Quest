
# Nation Quest — Game Description

Nation Quest is a Wordle-inspired geography puzzle in which the player must discover a hidden country name within a small number of guesses. Each guess must be the name of a country; feedback is provided per-letter to indicate correct letters and positions, helping the player narrow down the solution.

Objective
- Find the hidden country before you run out of attempts.

Core rules
- Each guess must be a valid country name (see the built-in country list).
- After each guess the game marks letters as:
	- correct (right letter, right position),
	- present (right letter, wrong position), or
	- absent (letter not in the solution).
- You have a limited number of attempts (default: 5). Running out of attempts ends the game and reveals the solution.

Modes & features
- Hard Mode — revealed hints must be used in subsequent guesses.
- Timed Levels — optional levels give the player a countdown timer to finish the puzzle.
- Background music with a mute toggle and playback persistence.
- Dark mode and High Contrast mode for accessibility.
- Statistics — the app tracks wins, streaks, and guess distribution for the current session.

Controls
- Type using your keyboard or click the on-screen keyboard.
- Use the Enter key to submit a guess and Backspace/Delete to remove characters.

Data & word list
- The set of possible solutions (country names) is located at [src/constants/wordlist.ts](src/constants/wordlist.ts). Guesses are validated against that list plus a larger `VALID_GUESSES` list.

Tips
- Start with a country that has a mix of common letters to reveal information quickly.
- Pay attention to letters marked present — they must appear somewhere in future guesses.

Where to look in the source
- Main app: [src/App.tsx](src/App.tsx)
- Grid and tiles: [src/components/grid/Grid.tsx](src/components/grid/Grid.tsx)
- Keyboard: [src/components/keyboard/Keyboard.tsx](src/components/keyboard/Keyboard.tsx)
- Word/solution logic: [src/lib/words.ts](src/lib/words.ts)
- Persistence: [src/lib/localStorage.ts](src/lib/localStorage.ts)

Enjoy the game — good luck finding the country!

