"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTimerStore } from "@/store/useTimerStore";
import { audioEngine } from "@/lib/audio";

export function useTimer() {
  const { timeLeft, isActive, tick, incrementSets } = useTimerStore();

  // Refs for Wake Lock and iOS video fallback
  const wakeLockRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isIOS = useRef<boolean>(false);

  // Initialize iOS detection and video element
  useEffect(() => {
    if (typeof window !== "undefined") {
      isIOS.current = /iPad|iPhone|iPod/.test(navigator.userAgent);
    }
  }, []);

  // Initialize audio using singleton
  const initAudio = useCallback(() => {
    audioEngine.initAudio();
  }, []);

  const playBeep = useCallback((frequency = 440, duration = 0.1, type: "beep" | "final" = "beep") => {
    audioEngine.playBeep(frequency, duration, type);
  }, []);

  // iOS Wake Lock fallback: play silent video in loop
  const startIOSWakeLock = useCallback(() => {
    if (!isIOS.current) return;

    if (!videoRef.current) {
      // Create a silent video element
      const video = document.createElement("video");
      video.src = "data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC7W1vb3YAAABsbXZoZAAAAAAAAAAAAAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIYdHJhawAAAFx0a2hkAAAAAwAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAA=";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      videoRef.current = video;
    }

    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  const stopIOSWakeLock = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  // Screen Wake Lock implementation
  const requestWakeLock = useCallback(async () => {
    if (typeof window === "undefined") return;

    // Use iOS fallback
    if (isIOS.current) {
      startIOSWakeLock();
      return;
    }

    // Standard Wake Lock API
    if (!("wakeLock" in navigator)) return;

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
      // Fallback to iOS method if Wake Lock fails
      startIOSWakeLock();
    }
  }, [startIOSWakeLock]);

  const releaseWakeLock = useCallback(async () => {
    // Stop iOS video fallback
    stopIOSWakeLock();

    // Release standard Wake Lock
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log("Wake Lock released manually");
      } catch (err: any) {
        console.error(`Wake Lock Release Error: ${err?.name}, ${err?.message}`);
      }
    }
  }, [stopIOSWakeLock]);

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

  return { timeLeft, isActive, initAudio, requestWakeLock };
}
