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
    <main className="min-h-screen bg-gray-50 flex flex-col max-w-lg mx-auto overflow-hidden shadow-2xl">
      <Header />
      
      <div className="flex-1 flex flex-col justify-center gap-8 py-8">
        <section>
          <SetCounter />
        </section>

        <section>
          <TimerDisplay />
        </section>

        <section className="mt-auto">
          <div className="text-center mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Choix du temps</span>
          </div>
          <PresetGrid />
        </section>
      </div>

      <footer className="p-4 text-center text-gray-400 text-[10px] uppercase tracking-tighter bg-white border-t border-gray-100">
        Chronosport - Training Timer v1.0
      </footer>
    </main>
  );
}
