import { useState, useEffect } from "react";
import { Grid } from "./components/grid/Grid";
import { Keyboard } from "./components/keyboard/Keyboard";
import { InfoModal } from "./components/modals/InfoModal";
import { LevelModal } from "./components/modals/LevelModal";
import { StatsModal } from "./components/modals/StatsModal";
import { SettingsModal } from "./components/modals/SettingsModal";
import {
  WIN_MESSAGES,
  GAME_COPIED_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE,
  CORRECT_WORD_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
} from "./constants/strings";
import {
  getMaxWordLength,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  getGameLostInfoDelay,
  WELCOME_INFO_MODAL_MS,
} from "./constants/settings";
import {
  isWordInWordList,
  isWinningWord,
  solution,
  findFirstUnusedReveal,
  unicodeLength,
  setRandomSolution,
} from "./lib/words";
import { addStatsForCompletedGame, loadStats } from "./lib/stats";
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
  getStoredIsHighContrastMode,
} from "./lib/localStorage";
import { default as GraphemeSplitter } from "grapheme-splitter";

import "./App.css";
import { AlertContainer } from "./components/alerts/AlertContainer";
import { useAlert } from "./context/AlertContext";
import { Navbar } from "./components/navbar/Navbar";
import { MusicConsentModal } from "./components/modals/MusicConsentModal";
import { GiveUpWidget } from "./components/GiveUpWidget";

function App() {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const {
    showError: showErrorAlert,
    showSuccess: showSuccessAlert,
    hideAlert,
  } = useAlert();
  const [isGiveUpModalOpen, setIsGiveUpModalOpen] = useState(false);

  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameWon, setIsGameWon] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [currentRowClass, setCurrentRowClass] = useState("");
  const [isGameLost, setIsGameLost] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [roundId, setRoundId] = useState(0);
  const gameOver = isGameLost || isGameWon;
  const [levelName, setLevelName] = useState<string | null>(() => {
    const saved = localStorage.getItem("selectedLevel");
    return saved ? JSON.parse(saved).level : null;
  });

  const [levelTimeLeft, setLevelTimeLeft] = useState<number | null>(() => {
    const saved = localStorage.getItem("selectedLevel");
    return saved ? JSON.parse(saved).seconds ?? null : null;
  });

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme")
      ? localStorage.getItem("theme") === "dark"
      : prefersDarkMode
      ? true
      : false
  );
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  );
  const [isRevealing, setIsRevealing] = useState(false);
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage();
    if (loaded?.solution !== solution) {
      return [];
    }
    const gameWasWon = loaded.guesses.includes(solution);
    if (gameWasWon) {
      setIsGameWon(true);
    }
    if (loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true);
      showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
        persist: true,
      });
    }
    return loaded.guesses;
  });
  const handleGiveUp = () => {
    setIsGiveUpModalOpen(false);

    setStats(addStatsForCompletedGame(stats, MAX_CHALLENGES));
    setIsGameLost(true);

    showErrorAlert(CORRECT_WORD_MESSAGE(solution), { persist: true });

    setTimeout(() => setIsStatsModalOpen(true), 800);
  };

  const handleEnableMusic = () => {
    localStorage.setItem("musicMuted", "false");
    window.dispatchEvent(new Event("music-pref-changed"));
    setShowMusicModal(false);
  };

  const handleMuteMusic = () => {
    localStorage.setItem("musicMuted", "true");
    window.dispatchEvent(new Event("music-pref-changed"));
    setShowMusicModal(false);
  };

  const [stats, setStats] = useState(() => loadStats());

  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem("gameMode")
      ? localStorage.getItem("gameMode") === "hard"
      : false
  );

  // useEffect(() => {
  //   if (!sessionStorage.getItem("musicPromptShown")) {
  //     setShowMusicModal(true);
  //     sessionStorage.setItem("musicPromptShown", "1");
  //   }
  // }, []);

  const triggerMusicPromptOnce = () => {
    if (!sessionStorage.getItem("musicPromptShown")) {
      setShowMusicModal(true);
      sessionStorage.setItem("musicPromptShown", "1");
    }
  };

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage()) {
      setTimeout(() => {
        setIsInfoModalOpen(true);
      }, WELCOME_INFO_MODAL_MS);
    }
  }, []);

  const handleCloseInfoModal = () => {
    setIsInfoModalOpen(false);

    // 👇 Only open Level Modal automatically on FIRST run
    if (!sessionStorage.getItem("levelPromptShown")) {
      sessionStorage.setItem("levelPromptShown", "1");

      setTimeout(() => setIsLevelModalOpen(true), 200);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [isDarkMode, isHighContrastMode]);

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const handleHardMode = (isHard: boolean) => {
    if (guesses.length === 0 || localStorage.getItem("gameMode") === "hard") {
      setIsHardMode(isHard);
      localStorage.setItem("gameMode", isHard ? "hard" : "normal");
    } else {
      showErrorAlert(HARD_MODE_ALERT_MESSAGE);
    }
  };

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast);
    setStoredIsHighContrastMode(isHighContrast);
  };

  const clearCurrentRowClass = () => {
    setCurrentRowClass("");
  };

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution });
  }, [guesses]);

  const startNewGame = (random = false) => {
    if (random) {
      setRandomSolution();
    }

    sessionStorage.removeItem("gameState");

    setGuesses([]);
    setCurrentGuess("");
    setIsGameWon(false);
    setIsGameLost(false);
    setIsRevealing(false);
    setCurrentRowClass("");
    hideAlert && hideAlert();

    const selected = localStorage.getItem("selectedLevel");
    if (selected) {
      try {
        const parsed = JSON.parse(selected);
        setLevelTimeLeft(parsed.seconds ?? null);
      } catch {
        setLevelTimeLeft(null);
      }
    } else {
      setLevelTimeLeft(null);
    }

    saveGameStateToLocalStorage({ guesses: [], solution });

    // 👇 NEW — force Give-Up widget reset
    setRoundId((id) => id + 1);
  };

  useEffect(() => {
    if (!isGameWon && !isGameLost) {
      setIsGiveUpModalOpen(true);
    }
  }, [guesses.length]);

  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
      const delayMs = REVEAL_TIME_MS * getMaxWordLength();

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      });
    }

    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true);
      }, getGameLostInfoDelay());
    }
  }, [isGameWon, isGameLost, showSuccessAlert]);

  useEffect(() => {
    if (isGameWon || isGameLost) {
      setLevelTimeLeft(null); // stop the timer
    }
  }, [isGameWon, isGameLost]);

  useEffect(() => {
    if (levelTimeLeft === null) return;

    if (levelTimeLeft <= 0) {
      if (!isGameWon) {
        // 🔹 Count timeout as a completed (failed) game
        setStats(addStatsForCompletedGame(stats, MAX_CHALLENGES));

        setIsGameLost(true);

        showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
          persist: true,
        });

        // 🔹 Open stats AFTER stats are updated
        setTimeout(() => {
          setIsStatsModalOpen(true);
        }, 800);
      }

      setLevelTimeLeft(null);
      return;
    }

    const id = setInterval(() => {
      setLevelTimeLeft((t) => (t !== null ? t - 1 : t));
    }, 1000);

    return () => clearInterval(id);
  }, [levelTimeLeft, isGameWon]);

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= getMaxWordLength() &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`);
    }
  };

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join("")
    );
  };

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return;
    }

    if (!(unicodeLength(currentGuess) === getMaxWordLength())) {
      setCurrentRowClass("jiggle");
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      });
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass("jiggle");
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      });
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(currentGuess, guesses);
      if (firstMissingReveal) {
        setCurrentRowClass("jiggle");
        return showErrorAlert(firstMissingReveal, {
          onClose: clearCurrentRowClass,
        });
      }
    }

    setIsRevealing(true);
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false);
    }, REVEAL_TIME_MS * getMaxWordLength());

    const winningWord = isWinningWord(currentGuess);

    if (
      unicodeLength(currentGuess) === getMaxWordLength() &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess]);
      setCurrentGuess("");

      if (winningWord) {
        setStats(addStatsForCompletedGame(stats, guesses.length));
        return setIsGameWon(true);
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1));
        setIsGameLost(true);
        showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
          persist: true,
          delayMs: REVEAL_TIME_MS * getMaxWordLength() + 1,
        });
      }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        setIsLevelModalOpen={setIsLevelModalOpen}
      />
      <div className="pt-2 px-1 pb-8 md:max-w-7xl w-full mx-auto sm:px-6 lg:px-8 flex flex-col grow">
        <div className="pb-6 grow">
          {levelName && (
            <div
              className="text-center mb-3 text-sm font-semibold
    text-blue-700 dark:text-blue-300"
            >
              🎯 Level: {levelName}
              {levelTimeLeft !== null && (
                <>
                  {" • "}
                  <span
                    className={
                      levelTimeLeft <= 10
                        ? "timer-warning"
                        : "text-blue-700 dark:text-blue-300"
                    }
                  >
                    ⏳ Time left: {Math.floor(levelTimeLeft / 60)}:
                    {(levelTimeLeft % 60).toString().padStart(2, "0")}
                  </span>
                </>
              )}
            </div>
          )}

          <Grid
            guesses={guesses}
            currentGuess={currentGuess}
            isRevealing={isRevealing}
            currentRowClassName={currentRowClass}
          />
        </div>

        <Keyboard
          onChar={onChar}
          onDelete={onDelete}
          onEnter={onEnter}
          guesses={guesses}
          isRevealing={isRevealing}
        />
        <MusicConsentModal
          isOpen={showMusicModal}
          onEnable={handleEnableMusic}
          onMute={handleMuteMusic}
        />

        <InfoModal
          isOpen={isInfoModalOpen}
          handleClose={handleCloseInfoModal}
        />
        <LevelModal
          isOpen={isLevelModalOpen}
          handleClose={() => {
            setIsLevelModalOpen(false);
            setTimeout(() => triggerMusicPromptOnce(), 200);
          }}
          onSelectLevel={(level, seconds) => {
            console.log("Selected level", level, seconds);
            setLevelName(level);

            localStorage.setItem(
              "selectedLevel",
              JSON.stringify({ level, seconds })
            );
            if (seconds) {
              setLevelTimeLeft(seconds);
            } else {
              setLevelTimeLeft(null);
            }
          }}
          onLevelTimeout={(level) => {
            console.log("Level timed out", level);
            setLevelTimeLeft(null);
            setLevelName(null);
            // You can also reset guesses or end game here if you want
          }}
        />

        <StatsModal
          isOpen={isStatsModalOpen}
          handleClose={() => setIsStatsModalOpen(false)}
          guesses={guesses}
          gameStats={stats}
          isGameLost={isGameLost}
          isGameWon={isGameWon}
          gameOver={gameOver}
          handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
          isHardMode={isHardMode}
          isDarkMode={isDarkMode}
          isHighContrastMode={isHighContrastMode}
          numberOfGuessesMade={guesses.length}
          onNewGame={() => startNewGame(true)}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          handleClose={() => setIsSettingsModalOpen(false)}
          isHardMode={isHardMode}
          handleHardMode={handleHardMode}
          isDarkMode={isDarkMode}
          handleDarkMode={handleDarkMode}
          isHighContrastMode={isHighContrastMode}
          handleHighContrastMode={handleHighContrastMode}
        />
        <GiveUpWidget
          key={roundId}
          initialDelay={60}
          holdTime={2}
          disabled={gameOver}
          onGiveUp={handleGiveUp}
        />

        <AlertContainer />
      </div>
    </div>
  );
}

export default App;
