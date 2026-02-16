"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun, RotateCcw } from "lucide-react";
import { useTimerStore } from "@/store/useTimerStore";

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const clearSets = useTimerStore((state) => state.clearSets);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="flex items-center justify-between p-6">
      <h1 className="text-xl font-black uppercase tracking-tighter text-primary">
        Chronosport
      </h1>
      <div className="flex gap-4">
        <button
          onClick={clearSets}
          className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-accent transition-colors"
          title="Reset Sets"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-accent transition-colors"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
}
