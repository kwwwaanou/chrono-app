"use client";

import React from "react";
import { useTimerStore } from "@/store/useTimerStore";
import { formatTime } from "@/lib/utils";
import { Play, Pause, RotateCcw } from "lucide-react";

export function TimerDisplay() {
  const { timeLeft, isActive, startTimer, pauseTimer, resetTimer } = useTimerStore();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-lg border border-gray-100 mx-4">
      <div className={
        `text-8xl font-mono font-bold tabular-nums mb-8 transition-colors ${
          timeLeft <= 5 && isActive ? "text-red-500 scale-105" : "text-gray-800"
        }`
      }>
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-6">
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all active:scale-90"
        >
          <RotateCcw size={32} />
        </button>

        {isActive ? (
          <button
            onClick={pauseTimer}
            className="p-4 rounded-full bg-gray-800 text-white hover:bg-black transition-all active:scale-90 shadow-lg"
          >
            <Pause size={32} />
          </button>
        ) : (
          <button
            onClick={startTimer}
            className="p-4 rounded-full bg-[#FF5722] text-white hover:bg-[#E64A19] transition-all active:scale-90 shadow-lg"
          >
            <Play size={32} className="ml-1" />
          </button>
        )}
      </div>
    </div>
  );
}
