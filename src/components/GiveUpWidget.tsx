import { useEffect, useState, useRef } from "react";

type Props = {
  initialDelay?: number;
  holdTime?: number;
  disabled?: boolean;
  onGiveUp: () => void;
};

export const GiveUpWidget = ({
  initialDelay = 60,
  holdTime = 3,
  disabled = false,
  onGiveUp,
}: Props) => {
  const [countdown, setCountdown] = useState(initialDelay);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const holdInterval = useRef<NodeJS.Timeout | null>(null);

  // ⏳ Unlock timer
  useEffect(() => {
    if (disabled || isUnlocked) return;
    if (countdown <= 0) {
      setIsUnlocked(true);
      return;
    }

    const id = setInterval(() => setCountdown((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [countdown, disabled, isUnlocked]);

  // 🖐 Hold to Give Up
  const startHold = () => {
    if (!isUnlocked || disabled) return;

    let progress = 0;
    holdInterval.current = setInterval(() => {
      progress += 0.1;
      setHoldProgress(progress / holdTime);

      if (progress >= holdTime) {
        clearInterval(holdInterval.current!);
        onGiveUp();
      }
    }, 100);
  };

  const cancelHold = () => {
    if (holdInterval.current) clearInterval(holdInterval.current);
    setHoldProgress(0);
  };

  // 🎨 % ring progress
  const percent = isUnlocked
    ? Math.min(holdProgress * 100, 100)
    : ((initialDelay - countdown) / initialDelay) * 100;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="giveup-widget select-none">
      <div className="flex flex-col items-center gap-2">
        {/* Transparent floating ring */}
        <div
          className="relative w-24 h-24 rounded-full cursor-pointer"
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
        >
          <svg className="absolute inset-0 -rotate-90" width="96" height="96">
            {/* subtle outer track */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="8"
              fill="none"
            />

            {/* animated progress ring */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={isUnlocked ? "#ff4d4d" : "#4aa4ff"}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - percent / 100)}
              style={{
                transition: "stroke-dashoffset 0.35s ease-out",
              }}
            />
          </svg>

          {/* center text — fully transparent background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-semibold text-sm drop-shadow-sm">
              {isUnlocked ? "Hold" : `${countdown}s`}
            </span>
          </div>
        </div>

        <p className="text-slate-200 text-xs font-medium">
          {isUnlocked ? "Hold to Give Up" : ""}
        </p>
      </div>
    </div>
  );
};
