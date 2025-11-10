'use client';

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "classic" | "slate" | "noir";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  themes: ThemeMode[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "iwsl_theme_preference";
const DEFAULT_THEME: ThemeMode = "classic";
const THEME_OPTIONS: ThemeMode[] = ["classic", "slate", "noir"];

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored && THEME_OPTIONS.includes(stored)) {
      setThemeState(stored);
      applyTheme(stored);
    } else {
      applyTheme(DEFAULT_THEME);
    }
  }, []);

  const setTheme = (next: ThemeMode) => {
    setThemeState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
    applyTheme(next);
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      themes: THEME_OPTIONS,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

