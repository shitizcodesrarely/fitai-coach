"use client";
import { getLevelTitle, getXpForLevel } from "@/constants/ranks";

export default function XPBar({ xp = 0, level = 1 }) {
  const levelInfo   = getLevelTitle(level);
  const currentXp   = getXpForLevel(level);
  const nextXp      = getXpForLevel(level + 1);
  const progress    = level >= 50 ? 100 : Math.round(((xp - currentXp) / (nextXp - currentXp)) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <span
            className="text-sm font-bold"
            style={{ color: "var(--accent)" }}
          >
            {levelInfo.title}
          </span>
          <span
            className="text-xs ml-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Level {level} · {levelInfo.universe}
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {xp.toLocaleString()} XP
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{
            width:      `${Math.min(progress, 100)}%`,
            background: "linear-gradient(90deg, var(--accent), #4ade80)",
          }}
        />
      </div>

      {level < 50 && (
        <div
          className="text-xs mt-1 text-right"
          style={{ color: "var(--text-secondary)" }}
        >
          {(nextXp - xp).toLocaleString()} XP to Level {level + 1}
        </div>
      )}
    </div>
  );
}
