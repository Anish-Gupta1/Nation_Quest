import { useEffect, useRef } from "react";

type Props = {
  src: string;
};

export default function BackgroundMusic({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.4;

    // Try playing immediately
    const tryPlay = async () => {
      try {
        await audio.play();
      } catch {
        // If autoplay is blocked, start after first user click
        const unlock = async () => {
          try {
            await audio.play();
            document.removeEventListener("click", unlock);
          } catch {}
        };
        document.addEventListener("click", unlock);
      }
    };

    tryPlay();
  }, []);

  return <audio ref={audioRef} src={src} />;
}
