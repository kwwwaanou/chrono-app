"use client";

import { Header } from "@/components/Header";
import { SetCounter } from "@/components/SetCounter";
import { TimerDisplay } from "@/components/TimerDisplay";
import { PresetGrid } from "@/components/PresetGrid";
import { useTimer } from "@/hooks/useTimer";

export default function Home() {
  // Activate the timer logic
  useTimer();

  return (
    <main className="min-h-screen bg-background flex flex-col max-w-lg mx-auto overflow-hidden">
      <Header />
      
      <div className="flex-1 flex flex-col justify-between py-4">
        <section>
          <SetCounter />
        </section>

        <section className="flex-1 flex items-center justify-center">
          <TimerDisplay />
        </section>

        <section className="mt-auto">
          <div className="text-center mb-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Select Intensity
            </span>
          </div>
          <PresetGrid />
        </section>
      </div>

      <footer className="p-6 text-center text-muted-foreground/30 text-[10px] font-bold uppercase tracking-widest">
        Chrono-App • v1.3.0
      </footer>
    </main>
  );
}
