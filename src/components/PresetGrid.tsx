"use client";

import React, { useState } from "react";
import { useTimerStore } from "@/store/useTimerStore";
import { useTimer } from "@/hooks/useTimer";
import { MoreVertical, X, Check } from "lucide-react";

export function PresetGrid() {
  const { setTimer, startTimer, initialTime, presets, updatePreset } = useTimerStore();
  const { initAudio } = useTimer();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const handlePresetClick = (seconds: number) => {
    initAudio();
    setTimer(seconds);
    // Use a small timeout to ensure state is updated before starting
    setTimeout(() => startTimer(), 10);
  };

  const handleEditClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditValue(presets[index].value.toString());
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const seconds = parseInt(editValue, 10);
      if (!isNaN(seconds) && seconds > 0) {
        updatePreset(editingIndex, seconds);
      }
      setEditingIndex(null);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto px-4 pb-6">
      <div className="grid grid-cols-4 gap-2">
        {presets.map((preset, index) => (
          <button
            key={`${preset.value}-${index}`}
            onClick={() => handlePresetClick(preset.value)}
            className={`relative group py-3 rounded-xl text-sm font-black transition-all active:scale-95 border-2 flex items-center justify-center ${
              initialTime === preset.value
                ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(255,87,34,0.3)] scale-105"
                : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted"
            }`}
          >
            {preset.label}
            <div
              onClick={(e) => handleEditClick(e, index)}
              className="absolute -top-1 -right-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-full hover:bg-muted"
            >
              <MoreVertical className="w-3 h-3 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>

      {editingIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-card border-2 border-border rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Edit Preset</h3>
              <button 
                onClick={() => setEditingIndex(null)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1 ml-1">
                    Seconds
                  </label>
                  <input
                    autoFocus
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-background border-2 border-border focus:border-primary outline-none px-4 py-3 rounded-xl text-lg font-mono transition-colors"
                    placeholder="Enter seconds..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-black py-3 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
