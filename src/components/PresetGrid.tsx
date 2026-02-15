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
  const { setTimer, initialTime } = useTimerStore();

  return (
    <div className="grid grid-cols-4 gap-3 p-4 w-full max-w-md mx-auto">
      {PRESETS.map((preset) => (
        <button
          key={preset.value}
          onClick={() => setTimer(preset.value)}
          className={`py-3 rounded-xl font-bold transition-all active:scale-95 ${
            initialTime === preset.value
              ? "bg-[#FF5722] text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
