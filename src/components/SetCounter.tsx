"use client";

import React from "react";
import { useTimerStore } from "@/store/useTimerStore";

export function SetCounter() {
  const { completedSets } = useTimerStore();

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-3 p-4 sm:p-8">
      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
        Sets Completed
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl sm:text-5xl font-black text-foreground leading-none">
          {completedSets}
        </span>
        <span className="text-lg sm:text-xl font-bold text-primary">SETS</span>
      </div>
      
      <div className="flex gap-1 mt-1 sm:mt-2 flex-wrap justify-center max-w-[180px] sm:max-w-[200px]">
        {Array.from({ length: Math.min(completedSets, 20) }).map((_, i) => (
          <div 
            key={i} 
            className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,87,34,0.4)]" 
          />
        ))}
        {completedSets > 20 && (
          <div className="text-[10px] font-bold text-muted-foreground">+</div>
        )}
      </div>
    </div>
  );
}
