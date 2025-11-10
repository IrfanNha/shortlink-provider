export const THEME = {
  background: "#FAFAFA",
  text: "#1A1A1A",
  accent: {
    blue: "#007AFF",
    orange: "#FF6F00",
    green: "#7ED957",
  },
  borderRadius: "6px",
} as const;

export type Theme = typeof THEME;

