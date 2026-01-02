import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
  AdjustmentsIcon,
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
  // Load saved preference
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem("musicMuted") === "true";
  });

  // 🔁 Listen to changes triggered by the modal
  useEffect(() => {
    const handler = () => {
      setIsMuted(localStorage.getItem("musicMuted") === "true");
    };

    window.addEventListener("music-pref-changed", handler);
    return () => window.removeEventListener("music-pref-changed", handler);
  }, []);

  // 🎵 Sync audio element
  useEffect(() => {
    const audio = document.getElementById(
      "bg-music"
    ) as HTMLAudioElement | null;
    if (!audio) return;

    audio.muted = isMuted;

    if (!isMuted) {
      audio.play().catch(() => {
        setIsMuted(true);
      });
    }
  }, [isMuted]);

  useEffect(() => {
    const audio = document.getElementById(
      "bg-music"
    ) as HTMLAudioElement | null;
    if (!audio) return;

    // restore last position if it exists
    const t = sessionStorage.getItem("musicTime");
    if (t) audio.currentTime = parseFloat(t);

    audio.muted = isMuted;

    if (!isMuted) {
      audio.play().catch(() => setIsMuted(true));
    }

    // 🔹 Save progress as the song plays
    const saveTime = () => {
      sessionStorage.setItem("musicTime", String(audio.currentTime));
    };
    audio.addEventListener("timeupdate", saveTime);

    return () => audio.removeEventListener("timeupdate", saveTime);
  }, [isMuted]);

  // 🎛 Navbar toggle
  const toggleMusic = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem("musicMuted", String(next));
      window.dispatchEvent(new Event("music-pref-changed"));
      return next;
    });
  };

  return (
    <div className="navbar">
      <div className="navbar-content px-6 py-2">
        <div className="right-icons">
          <button
            onClick={toggleMusic}
            className="cursor-pointer mr-2  text-3xl leading-none select-none"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          <InformationCircleIcon
            className="h-8 w-8 mr-2 cursor-pointer dark:stroke-white"
            onClick={() => setIsInfoModalOpen(true)}
          />

        </div>

        <p className="text-3xl ml-2.5 font-bold dark:text-white">
          {GAME_TITLE}
        </p>

        <div className="right-icons">
          <ChartBarIcon
            className="h-8 w-8 mr-3 cursor-pointer dark:stroke-white"
            onClick={() => setIsStatsModalOpen(true)}
          />
          <AdjustmentsIcon
            className="h-8 w-8 mr-2 cursor-pointer dark:stroke-white"
            onClick={() => setIsLevelModalOpen && setIsLevelModalOpen(true)}
          />
          <CogIcon
            className="h-8 w-8 cursor-pointer dark:stroke-white"
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
      <hr className="border-slate-400" />
    </div>
  );
};
