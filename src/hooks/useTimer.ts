"use client";

import { useEffect, useRef } from "react";
import { useTimerStore } from "@/store/useTimerStore";

export function useTimer() {
  const { timeLeft, isActive, tick, incrementSets, resetTimer } = useTimerStore();
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBeep = (frequency = 440, duration = 0.1) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error("Audio beep failed", e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      incrementSets();
      // Play a final long beep
      playBeep(880, 0.5);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, tick, incrementSets]);

  // Handle sound alerts for last 5 seconds
  useEffect(() => {
    if (isActive && timeLeft <= 5 && timeLeft > 0) {
      playBeep(440, 0.1);
    }
  }, [timeLeft, isActive]);

  return { timeLeft, isActive };
}
