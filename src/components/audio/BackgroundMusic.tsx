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
    audio.muted = true; // Start muted to allow autoplay

    // Try playing immediately (works because muted)
    const tryPlay = async () => {
      try {
        await audio.play();
      } catch (e) {
        console.log("Autoplay failed:", e);
      }
    };

    tryPlay();
  }, []);

  return <audio ref={audioRef} src={src} />;
}
