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

  const playBeep = useCallback((frequency = 440, duration = 0.1, type: "beep" | "final" = "beep") => {
    try {
      initAudio();
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type === "final" ? "square" : "sine";
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
    if (typeof window === "undefined" || !("wakeLock" in navigator)) return;
    
    try {
      // If a lock already exists, don't request a new one
      if (wakeLockRef.current) return;
      
      wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
      
      // Re-acquire lock if it's released by the system (e.g. after coming back from background)
      wakeLockRef.current.addEventListener("release", () => {
        console.log("Wake Lock was released by system");
        wakeLockRef.current = null;
      });
      
      console.log("Wake Lock acquired");
    } catch (err: any) {
      console.error(`Wake Lock Error: ${err?.name}, ${err?.message}`);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log("Wake Lock released manually");
      } catch (err: any) {
        console.error(`Wake Lock Release Error: ${err?.name}, ${err?.message}`);
      }
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
    } else {
      // Covers paused state, timeLeft === 0, and idle
      if (timeLeft === 0 && isActive) {
        playBeep(880, 0.5, "final");
      }
      releaseWakeLock();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, tick, playBeep, requestWakeLock, releaseWakeLock]);

  // Handle visibility change to re-request wake lock
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (isActive && document.visibilityState === "visible") {
        await requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      releaseWakeLock(); // Component unmount safety
    };
  }, [isActive, requestWakeLock, releaseWakeLock]);

  return { timeLeft, isActive, initAudio };
}
