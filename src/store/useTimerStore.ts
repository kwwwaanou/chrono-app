import { create } from "zustand";

interface TimerState {
  timeLeft: number;
  initialTime: number;
  isActive: boolean;
  completedSets: number;
  
  // Actions
  setTimer: (seconds: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  incrementSets: () => void;
  clearSets: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  timeLeft: 0,
  initialTime: 0,
  isActive: false,
  completedSets: 0,

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
    return { timeLeft: state.timeLeft - 1 };
  }),

  incrementSets: () => set((state) => ({ 
    completedSets: state.completedSets + 1 
  })),

  clearSets: () => set({ completedSets: 0 }),
}));
