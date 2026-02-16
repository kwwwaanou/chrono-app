"use client";

import React from "react";
import { useTimerStore } from "@/store/useTimerStore";

export function SetCounter() {
  const { completedSets } = useTimerStore();

  return (
    <div className="flex flex-col items-center gap-3 p-8">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
        Sets Completed
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-black text-foreground">
          {completedSets}
        </span>
        <span className="text-xl font-bold text-primary">SETS</span>
      </div>
      
      <div className="flex gap-1.5 mt-2 flex-wrap justify-center max-w-[200px]">
        {Array.from({ length: Math.min(completedSets, 20) }).map((_, i) => (
          <div 
            key={i} 
            className="w-2 h-2 rounded-full bg-primary" 
          />
        ))}
        {completedSets > 20 && (
          <div className="text-xs font-bold text-muted-foreground">+</div>
        )}
      </div>
    </div>
  );
}
