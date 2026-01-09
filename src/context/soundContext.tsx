import React, { createContext, useContext, useEffect, useRef } from "react";
import { useSettings } from "./settingContext";

type SoundMap = {
  click: HTMLAudioElement;
  success: HTMLAudioElement;
  error: HTMLAudioElement;
};

const SoundContext = createContext<{
  play: (name: keyof SoundMap) => void;
} | null>(null);

const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const { state } = useSettings();
  const soundsRef = useRef<SoundMap | null>(null);

  // Initialize sounds ONCE
  useEffect(() => {
    soundsRef.current = {
      click: new Audio("/src/assets/sounds/click.wav"),
      success: new Audio("/src/assets/sounds/success.wav"),
      error: new Audio("/src/assets/sounds/error.wav"),
    };

    // lower volume (important)
    Object.values(soundsRef.current).forEach((a) => {
      a.volume = 0.5;
      a.preload = "auto";
    });
  }, []);

  function play(name: keyof SoundMap) {
    if (!state.soundOn) return;
    const audio = soundsRef.current?.[name];
    if (!audio) return;

    // reset so rapid clicks work
    audio.currentTime = 0;
    audio.play().catch(() => {
      // ignored: browser requires user interaction
    });
  }

  return (
    <SoundContext.Provider value={{ play }}>
      {children}
    </SoundContext.Provider>
  );
}

export default SoundProvider;

const useSound = () => {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside SoundProvider");
  return ctx;
}

export { useSound };