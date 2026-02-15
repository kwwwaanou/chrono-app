"use client";

import React from "react";
import { useTimerStore } from "@/store/useTimerStore";
import { RotateCcw } from "lucide-react";

export function SetCounter() {
  const { completedSets, clearSets } = useTimerStore();

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <span className="text-sm font-semibold uppercase text-muted-foreground">Séries Terminées</span>
      <div className="flex items-center gap-4">
        <div className="flex gap-1 flex-wrap justify-center">
          {Array.from({ length: Math.min(completedSets, 10) }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-secondary shadow-sm" />
          ))}
          {completedSets > 0 && (
            <span className="ml-2 font-bold text-secondary">x{completedSets}</span>
          )}
          {completedSets === 0 && (
            <span className="text-gray-300 italic">Aucune série</span>
          )}
        </div>
        {completedSets > 0 && (
          <button 
            onClick={clearSets}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            title="Réinitialiser les séries"
          >
            <RotateCcw size={16} className="text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
}
