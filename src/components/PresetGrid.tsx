"use client";

import React from "react";
import { useTimerStore } from "@/store/useTimerStore";

const PRESETS = [
  { label: "30s", value: 30 },
  { label: "45s", value: 45 },
  { label: "1m", value: 60 },
  { label: "1m30", value: 90 },
  { label: "2m", value: 120 },
  { label: "3m", value: 180 },
  { label: "5m", value: 300 },
  { label: "10m", value: 600 },
];

export function PresetGrid() {
  const { setTimer, startTimer, initialTime } = useTimerStore();

  const handlePresetClick = (seconds: number) => {
    setTimer(seconds);
    // Use a small timeout to ensure state is updated before starting
    setTimeout(() => startTimer(), 10);
  };

  return (
    <div className="grid grid-cols-4 gap-3 p-6 w-full max-w-md mx-auto">
      {PRESETS.map((preset) => (
        <button
          key={preset.value}
          onClick={() => handlePresetClick(preset.value)}
          className={`py-4 rounded-2xl font-black transition-all active:scale-95 ${
            initialTime === preset.value
              ? "bg-primary text-primary-foreground shadow-lg scale-105"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
