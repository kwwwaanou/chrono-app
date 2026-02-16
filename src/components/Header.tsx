"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun, RotateCcw } from "lucide-react";
import { useTimerStore } from "@/store/useTimerStore";

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const clearSets = useTimerStore((state) => state.clearSets);

  useEffect(() => {
    // Initial theme setup: default to dark if no saved preference
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Force direct DOM manipulation
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleReset = () => {
    if (confirm("Reset all completed sets?")) {
      clearSets();
    }
  };

  return (
    <header className="flex items-center justify-between p-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-foreground">
          CHRONO<span className="text-primary">SPORT</span>
        </h1>
        <div className="h-1 w-full bg-primary rounded-full mt-[-2px]" />
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleReset}
          className="p-3 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all active:scale-90"
          title="Reset Sets"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all active:scale-90"
          title="Toggle Theme"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
}
