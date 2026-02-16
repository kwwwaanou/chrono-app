"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTimerStore } from "@/store/useTimerStore";

export function useTimer() {
  const { timeLeft, isActive, tick, incrementSets } = useTimerStore();
  
  // Refs for Web Audio API mixing and iOS background support
  const audioContextRef = useRef<AudioContext | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Initialize Audio Context on user interaction to ensure it works on iOS
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    // Resume context if suspended (common in browsers/iOS)
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
  }, []);

  const playBeep = useCallback((frequency = 440, duration = 0.1) => {
    try {
      initAudio();
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      // Web Audio API mixing: play alongside other apps
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error("Audio beep failed", e);
    }
  }, [initAudio]);

  // Screen Wake Lock implementation
  const requestWakeLock = useCallback(async () => {
    if ("wakeLock" in navigator && !wakeLockRef.current) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        console.log("Wake Lock active");
      } catch (err: any) {
        console.error(`${err?.name}, ${err?.message}`);
      }
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      console.log("Wake Lock released");
    }
  }, []);

  // Timer Tick Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      requestWakeLock();
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // incrementSets is now handled in store's tick() to avoid race conditions
      playBeep(880, 0.5); // Final beep
      releaseWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, tick, incrementSets, playBeep, requestWakeLock, releaseWakeLock]);

  // Sound Alerts for the last 5 seconds
  useEffect(() => {
    if (isActive && timeLeft <= 5 && timeLeft >= 0) {
      playBeep(440, 0.1);
    }
  }, [timeLeft, isActive, playBeep]);

  // Handle visibility change to re-request wake lock if tab becomes active again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isActive && document.visibilityState === "visible") {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive, requestWakeLock]);

  return { timeLeft, isActive, initAudio };
}
