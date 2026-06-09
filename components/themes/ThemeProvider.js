"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { THEMES, DEFAULT_THEME } from "@/constants/themes";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(DEFAULT_THEME);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("fitai-theme") ?? DEFAULT_THEME;
    setThemeState(saved);
    applyTheme(saved);
  }, []);

  function setTheme(name) {
    setThemeState(name);
    localStorage.setItem("fitai-theme", name);
    applyTheme(name);
  }

  function applyTheme(name) {
    const t = THEMES[name] ?? THEMES[DEFAULT_THEME];
    const root = document.documentElement;
    Object.entries(t.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
