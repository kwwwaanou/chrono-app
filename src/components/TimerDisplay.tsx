"use client";

import React from "react";
import { useTimerStore } from "@/store/useTimerStore";
import { formatTime } from "@/lib/utils";
import { Play, Pause, RotateCcw } from "lucide-react";

export function TimerDisplay() {
  const { timeLeft, initialTime, isActive, startTimer, pauseTimer, resetTimer } = useTimerStore();

  const progress = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 mx-4 relative">
      <div className="relative flex items-center justify-center">
        <svg className="w-64 h-64 -rotate-90">
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted/20"
          />
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-linear"
          />
        </svg>

        <div className={`absolute text-6xl font-black tabular-nums transition-all ${
          timeLeft <= 5 && isActive ? "text-red-500 scale-110" : "text-foreground"
        }`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-8 mt-12">
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-muted text-muted-foreground hover:bg-accent transition-all active:scale-90"
        >
          <RotateCcw size={28} />
        </button>

        {isActive ? (
          <button
            onClick={pauseTimer}
            className="p-6 rounded-full bg-foreground text-background hover:opacity-90 transition-all active:scale-95 shadow-2xl"
          >
            <Pause size={32} />
          </button>
        ) : (
          <button
            onClick={startTimer}
            className="p-6 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all active:scale-95 shadow-2xl"
          >
            <Play size={32} className="ml-1" />
          </button>
        )}
      </div>
    </div>
  );
}
