import React from "react";

type Props = {
  isOpen: boolean;
  onEnable: () => void;
  onMute: () => void;
};


export const MusicConsentModal = ({ isOpen, onEnable, onMute }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl text-center max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-3 dark:text-white">
          🎵 Enable Background Music?
        </h2>

        <p className="text-sm mb-5 dark:text-slate-200">
          You can change this anytime from the music button in the navbar.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onMute}
            className="px-4 py-2 rounded-lg bg-slate-300 dark:bg-slate-700 dark:text-white"
          >
            🔇 No Music
          </button>

          <button
            onClick={onEnable}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white"
          >
            🔊 Play Music
          </button>
        </div>
      </div>
    </div>
  );
};
