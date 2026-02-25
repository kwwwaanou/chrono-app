"use client";

class AudioEngine {
  private static instance: AudioEngine;
  private audioContext: AudioContext | null = null;

  private constructor() {}

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  public initAudio(): AudioContext {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }
    // Resume context if suspended (common in browsers/iOS)
    if (this.audioContext?.state === "suspended") {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  public playBeep(frequency = 440, duration = 0.1, type: "beep" | "final" = "beep"): void {
    try {
      const ctx = this.initAudio();
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
  }

  public getContext(): AudioContext | null {
    return this.audioContext;
  }
}

export const audioEngine = AudioEngine.getInstance();
