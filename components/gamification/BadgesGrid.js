"use client";
import { BADGES } from "@/constants/badges";

export default function BadgesGrid({ earnedBadges = [] }) {
  const earnedKeys = new Set(earnedBadges.map((b) => b.badge?.key ?? b.key));

  return (
    <div className="grid grid-cols-3 gap-3">
      {BADGES.filter((b) => !b.secret || earnedKeys.has(b.key)).map((badge) => {
        const earned = earnedKeys.has(badge.key);
        return (
          <div
            key={badge.key}
            className="rounded-xl p-3 flex flex-col items-center text-center transition-all"
            style={{
              background:  earned ? "var(--accent-light)" : "var(--bg-secondary)",
              border:      `1px solid ${earned ? "var(--accent)" : "var(--border)"}`,
              opacity:     earned ? 1 : 0.45,
            }}
            title={badge.description}
          >
            <span className="text-2xl mb-1">{badge.icon}</span>
            <div
              className="text-xs font-medium leading-tight"
              style={{ color: earned ? "var(--accent-text)" : "var(--text-secondary)" }}
            >
              {badge.name}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "var(--text-secondary)", fontSize: 10 }}
            >
              {badge.universe}
            </div>
          </div>
        );
      })}
    </div>
  );
}
