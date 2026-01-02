import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
  GlobeAltIcon,
} from "@heroicons/react/outline";
import { GAME_TITLE } from "../../constants/strings";

type Props = {
  setIsInfoModalOpen: (value: boolean) => void;
  setIsStatsModalOpen: (value: boolean) => void;
  setIsSettingsModalOpen: (value: boolean) => void;
  setIsLevelModalOpen?: (value: boolean) => void;
};

export const Navbar = ({
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
  setIsLevelModalOpen,
}: Props) => {
  // Load saved preference (default: music ON)
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem("musicMuted") === "true";
  });


  useEffect(() => {
    const audio = document.getElementById(
      "bg-music"
    ) as HTMLAudioElement | null;
    if (!audio) return;

    audio.muted = isMuted;

    if (!isMuted) {
      // Try to play — if blocked, update UI to Off
      audio.play().catch(() => {
        setIsMuted(true); // browser blocked autoplay
      });
    }
  }, [isMuted]);

  // Save preference on toggle
  const toggleMusic = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem("musicMuted", String(next));
      return next;
    });
  };

  return (
    <div className="navbar">
      <div className="navbar-content px-5">
        <div className="right-icons">
          <InformationCircleIcon
            className="h-6 w-6 mr-2 cursor-pointer dark:stroke-white"
            onClick={() => setIsInfoModalOpen(true)}
          />
          <button
            onClick={toggleMusic}
            className="h-6 w-6 mr-2 cursor-pointer dark:stroke-white"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>

        <p className="text-xl ml-2.5 font-bold dark:text-white">{GAME_TITLE}</p>

        <div className="right-icons">
          <GlobeAltIcon
            className="h-6 w-6 mr-2 cursor-pointer dark:stroke-white"
            onClick={() => setIsLevelModalOpen && setIsLevelModalOpen(true)}
          />
          <ChartBarIcon
            className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white"
            onClick={() => setIsStatsModalOpen(true)}
          />
          <CogIcon
            className="h-6 w-6 cursor-pointer dark:stroke-white"
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
      <hr className="border-slate-400" />
    </div>
  );
};
