"use client";
import { useTheme } from "./ThemeProvider";

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div>
      <p
        className="text-xs font-medium uppercase tracking-wide mb-3"
        style={{ color: "var(--text-secondary)" }}
      >
        App Theme
      </p>
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(themes).map(([key, t]) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
            style={{
              border:     `2px solid ${theme === key ? "var(--accent)" : "var(--border)"}`,
              background: "var(--bg-secondary)",
            }}
          >
            {/* Color preview dots */}
            <div className="flex gap-0.5">
              {t.preview.map((color, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{ width: 8, height: 8, background: color }}
                />
              ))}
            </div>
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)", fontSize: 10 }}
            >
              {t.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
