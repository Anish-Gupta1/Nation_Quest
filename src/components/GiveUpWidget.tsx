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


  // 🔹 Smooth timer in milliseconds
  const [timeLeftMs, setTimeLeftMs] = useState(initialDelay * 1000);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // 🔹 Hold progress (0 → 1)
  const [holdProgress, setHoldProgress] = useState(0);

  const holdInterval = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    if (disabled || isUnlocked) return;

    const start = Date.now();
    const total = initialDelay * 1000;

    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(total - elapsed, 0);

      setTimeLeftMs(remaining);

      if (remaining === 0) {
        setIsUnlocked(true);
        clearInterval(id);
      }
    }, 50); 

    return () => clearInterval(id);
  }, [disabled, isUnlocked, initialDelay]);


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


  const secondsLeft = Math.ceil(timeLeftMs / 1000);

  const percent = isUnlocked
    ? Math.min(holdProgress * 100, 100)
    : ((initialDelay * 1000 - timeLeftMs) / (initialDelay * 1000)) * 100;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;


  return (
    <div className={`giveup-widget ${isUnlocked ? "unlocked" : ""} select-none`}>
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative w-24 h-24 rounded-full cursor-pointer"
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
        >
          <svg
            className="absolute inset-0 -rotate-90"
            width="96"
            height="96"
          >
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="8"
              fill="none"
            />

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
                transition: "stroke-dashoffset 0.1s linear",
              }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-semibold text-sm drop-shadow-sm">
              {isUnlocked ? "Hold" : `${secondsLeft}s`}
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
