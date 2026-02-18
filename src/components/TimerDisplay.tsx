"use client";

import React from "react";
import { useTimerStore } from "@/store/useTimerStore";
import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/lib/utils";
import { Play, Pause, RotateCcw } from "lucide-react";

export function TimerDisplay() {
  const { timeLeft, initialTime, isActive, startTimer, pauseTimer, resetTimer } = useTimerStore();
  const { initAudio, requestWakeLock } = useTimer();

  const handleStart = () => {
    initAudio();
    requestWakeLock(); // Triggered by user gesture
    startTimer();
  };

  const progress = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 mx-2 relative scale-[0.85] sm:scale-100 origin-center">
      <div className="relative flex items-center justify-center">
        <svg className="w-56 h-56 sm:w-64 sm:h-64 -rotate-90 drop-shadow-sm">
          <circle
            cx="112"
            cy="112"
            r="100"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-muted sm:hidden"
          />
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-muted hidden sm:block"
          />
          <circle
            cx="112"
            cy="112"
            r="100"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 100}
            strokeDashoffset={2 * Math.PI * 100 - (progress / 100) * 2 * Math.PI * 100}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-linear sm:hidden"
          />
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-linear hidden sm:block"
          />
        </svg>

        <div className={`absolute text-5xl sm:text-6xl font-black tabular-nums transition-all drop-shadow-md ${
          timeLeft <= 5 && isActive ? "text-red-600 scale-110" : "text-foreground"
        }`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-6 sm:gap-8 mt-6 sm:mt-12">
        <button
          onClick={resetTimer}
          className="p-3 sm:p-4 rounded-full bg-muted text-muted-foreground hover:bg-accent transition-all active:scale-90"
        >
          <RotateCcw size={22} className="sm:w-7 sm:h-7" />
        </button>

        {isActive ? (
          <button
            onClick={pauseTimer}
            className="p-4 sm:p-6 rounded-full bg-foreground text-background hover:opacity-90 transition-all active:scale-95 shadow-2xl"
          >
            <Pause size={26} className="sm:w-8 sm:h-8" />
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="p-4 sm:p-6 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all active:scale-95 shadow-2xl"
          >
            <Play size={26} className="ml-1 sm:w-8 sm:h-8" />
          </button>
        )}
      </div>
    </div>
  );
}
