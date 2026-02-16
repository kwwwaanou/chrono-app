import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface TimerPreset {
  label: string;
  value: number;
}

interface TimerState {
  timeLeft: number;
  initialTime: number;
  isActive: boolean;
  completedSets: number;
  presets: TimerPreset[];
  
  // Actions
  setTimer: (seconds: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  incrementSets: () => void;
  clearSets: () => void;
  updatePreset: (index: number, seconds: number) => void;
}

const DEFAULT_PRESETS: TimerPreset[] = [
  { label: "25s", value: 25 },
  { label: "45s", value: 45 },
  { label: "1m", value: 60 },
  { label: "1m30", value: 90 },
  { label: "2m", value: 120 },
  { label: "3m", value: 180 },
  { label: "5m", value: 300 },
  { label: "10m", value: 600 },
];

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      timeLeft: 0,
      initialTime: 0,
      isActive: false,
      completedSets: 0,
      presets: DEFAULT_PRESETS,

      setTimer: (seconds) => set({ 
        timeLeft: seconds, 
        initialTime: seconds, 
        isActive: false 
      }),

      startTimer: () => set((state) => ({ 
        isActive: state.timeLeft > 0 
      })),

      pauseTimer: () => set({ isActive: false }),

      resetTimer: () => set((state) => ({ 
        timeLeft: state.initialTime, 
        isActive: false 
      })),

      tick: () => set((state) => {
        if (state.timeLeft <= 0) {
          return { isActive: false, timeLeft: 0 };
        }
        const nextTime = state.timeLeft - 1;
        if (nextTime === 0) {
          return { 
            timeLeft: 0, 
            isActive: false, 
            completedSets: state.completedSets + 1 
          };
        }
        return { timeLeft: nextTime };
      }),

      incrementSets: () => {}, // Handled in tick for reliability

      clearSets: () => set({ completedSets: 0 }),

      updatePreset: (index, seconds) => set((state) => {
        const newPresets = [...state.presets];
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        let label = "";
        
        if (minutes > 0) {
          label = `${minutes}m${secs > 0 ? secs : ""}`;
        } else {
          label = `${secs}s`;
        }

        newPresets[index] = { label, value: seconds };
        return { presets: newPresets };
      }),
    }),
    {
      name: "chronosport-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        completedSets: state.completedSets,
        presets: state.presets 
      }),
    }
  )
);
