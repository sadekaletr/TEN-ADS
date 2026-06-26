"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { unlockAudio } from "@/lib/sound/sfx";

const SOUND_KEY = "spark_sound_enabled";

interface MotionContextValue {
  reducedMotion: boolean;
  particlesEnabled: boolean;
  circuitWakeEnabled: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
}

const MotionContext = createContext<MotionContextValue>({
  reducedMotion: false,
  particlesEnabled: true,
  circuitWakeEnabled: true,
  soundEnabled: false,
  setSoundEnabled: () => {},
  toggleSound: () => {},
});

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SOUND_KEY);
      if (stored === "1") setSoundEnabledState(true);
    } catch {
      // ignore
    }
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    try {
      localStorage.setItem(SOUND_KEY, enabled ? "1" : "0");
    } catch {
      // ignore
    }
    if (enabled) unlockAudio();
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      if (next) unlockAudio();
      return next;
    });
  }, []);

  useEffect(() => {
    const onGesture = () => unlockAudio();
    window.addEventListener("pointerdown", onGesture, { once: true });
    return () => window.removeEventListener("pointerdown", onGesture);
  }, []);

  return (
    <MotionContext.Provider
      value={{
        reducedMotion,
        particlesEnabled: !reducedMotion,
        circuitWakeEnabled: !reducedMotion,
        soundEnabled,
        setSoundEnabled,
        toggleSound,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion() {
  return useContext(MotionContext);
}
