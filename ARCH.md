# Chronosport Architecture

## Project Overview
Chronosport is a mobile-first timer application designed for sports sets management.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React (optional)

## Directory Structure
```text
/root/.openclaw/workspace/OpenClaw/Projects/Chronosport/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with font and metadata
│   │   ├── page.tsx         # Main View (Mobile-first container)
│   │   └── globals.css      # Tailwind directives and global styles
│   ├── components/
│   │   ├── Header.tsx       # Orange header (#FF5722)
│   │   ├── SetCounter.tsx   # Blue indicator for completed sets
│   │   ├── TimerDisplay.tsx # Large countdown display
│   │   └── PresetGrid.tsx  # Grid of timer buttons (25s to 10m)
│   ├── store/
│   │   └── useTimerStore.ts # Zustand store for global state
│   ├── hooks/
│   │   └── useTimer.ts      # Custom hook for interval logic and sounds
│   └── lib/
│       └── utils.ts         # Formatting helpers (e.g., formatTime)
├── public/
│   └── sounds/              # Audio files for alerts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## State Management (`useTimerStore`)
The store handles the countdown state, the current active timer, and the set counter.

```typescript
interface TimerState {
  timeLeft: number;          // Current countdown in seconds
  initialTime: number;       // The original time selected
  isActive: boolean;         // Is the timer running?
  completedSets: number;     // Number of sessions finished
  
  // Actions
  setTimer: (seconds: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;          // Called every second by the hook
  incrementSets: () => void;
}
```

## Key Features Logic
- **Countdown**: Handled via `setInterval` in a custom hook, dispatching `tick()` to the store.
- **Sound Alerts**: Triggered when `timeLeft <= 5` and `isActive` is true.
- **Design**:
  - Header: `#FF5722`
  - Set Indicator: Blue
  - Buttons: Gray/Dark slate for a professional sports look.
