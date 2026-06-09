// All app themes
// CSS variables are injected into :root when theme is active

export const THEMES = {
  arctic: {
    name:        "Arctic",
    description: "Clean, minimal, white",
    preview:     ["#ffffff", "#16a34a", "#111827"],
    vars: {
      "--bg-primary":    "#ffffff",
      "--bg-secondary":  "#f9fafb",
      "--bg-tertiary":   "#f3f4f6",
      "--text-primary":  "#111827",
      "--text-secondary":"#6b7280",
      "--accent":        "#16a34a",
      "--accent-light":  "#dcfce7",
      "--accent-text":   "#15803d",
      "--border":        "#e5e7eb",
      "--sidebar-bg":    "#ffffff",
      "--card-bg":       "#ffffff",
    },
  },

  midnight: {
    name:        "Midnight",
    description: "Dark, electric blue",
    preview:     ["#0f172a", "#3b82f6", "#ffffff"],
    vars: {
      "--bg-primary":    "#0f172a",
      "--bg-secondary":  "#1e293b",
      "--bg-tertiary":   "#0f172a",
      "--text-primary":  "#f1f5f9",
      "--text-secondary":"#94a3b8",
      "--accent":        "#3b82f6",
      "--accent-light":  "#1e3a5f",
      "--accent-text":   "#93c5fd",
      "--border":        "#1e293b",
      "--sidebar-bg":    "#020617",
      "--card-bg":       "#1e293b",
    },
  },

  inferno: {
    name:        "Inferno",
    description: "Dark, aggressive orange",
    preview:     ["#1c0a00", "#f97316", "#ffffff"],
    vars: {
      "--bg-primary":    "#1c0a00",
      "--bg-secondary":  "#2d1200",
      "--bg-tertiary":   "#1c0a00",
      "--text-primary":  "#fff7ed",
      "--text-secondary":"#fdba74",
      "--accent":        "#f97316",
      "--accent-light":  "#431407",
      "--accent-text":   "#fed7aa",
      "--border":        "#431407",
      "--sidebar-bg":    "#0f0600",
      "--card-bg":       "#2d1200",
    },
  },

  forest: {
    name:        "Forest",
    description: "Deep green, calm focus",
    preview:     ["#0a1f0a", "#4ade80", "#fef9c3"],
    vars: {
      "--bg-primary":    "#0a1f0a",
      "--bg-secondary":  "#14291a",
      "--bg-tertiary":   "#0a1f0a",
      "--text-primary":  "#f0fdf4",
      "--text-secondary":"#86efac",
      "--accent":        "#4ade80",
      "--accent-light":  "#14532d",
      "--accent-text":   "#bbf7d0",
      "--border":        "#14532d",
      "--sidebar-bg":    "#052e16",
      "--card-bg":       "#14291a",
    },
  },

  cyberpunk: {
    name:        "Cyberpunk",
    description: "Black, neon purple",
    preview:     ["#000000", "#a855f7", "#22d3ee"],
    vars: {
      "--bg-primary":    "#000000",
      "--bg-secondary":  "#0d0d0d",
      "--bg-tertiary":   "#000000",
      "--text-primary":  "#fafafa",
      "--text-secondary":"#d8b4fe",
      "--accent":        "#a855f7",
      "--accent-light":  "#3b0764",
      "--accent-text":   "#e9d5ff",
      "--border":        "#3b0764",
      "--sidebar-bg":    "#000000",
      "--card-bg":       "#0d0d0d",
    },
  },
};

export const DEFAULT_THEME = "arctic";

export function getTheme(name) {
  return THEMES[name] ?? THEMES[DEFAULT_THEME];
}
