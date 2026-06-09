"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MasterYoda from "@/components/yoda/MasterYoda";
import { getSessionRank, getLevelTitle, getXpForLevel } from "@/constants/ranks";

export default function PostWorkoutScreen({ result, onClose }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  // Steps: 0=volume, 1=rank, 2=xp, 3=badges, 4=done

  const {
    totalVolumeKg = 0,
    xpEarned      = 0,
    newLevel       = 1,
    oldLevel       = 1,
    leveledUp      = false,
    newBadges      = [],
    streak         = 1,
  } = result ?? {};

  const rank      = getSessionRank(totalVolumeKg);
  const levelInfo = getLevelTitle(newLevel);

  // Auto-advance steps
  useEffect(() => {
    if (step >= 4) return;
    const delay = step === 0 ? 1200 : step === 1 ? 1800 : step === 2 ? 1500 : 1200;
    const t = setTimeout(() => setStep((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [step]);

  function finish() {
    onClose?.();
    router.push("/dashboard");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)" }}
    >
      <div className="flex flex-col items-center text-center px-6 max-w-sm w-full">

        {/* Yoda celebrating */}
        <MasterYoda mood="happy" size={80} showBubble={false} />
        <p className="text-xs italic mt-2 mb-6" style={{ color: "#86efac" }}>
          "{rank.yodaQuote}"
        </p>

        {/* Volume */}
        <div
          className="text-6xl font-bold mb-1 transition-all duration-700"
          style={{
            color: "#fff",
            opacity: step >= 0 ? 1 : 0,
            transform: step >= 0 ? "scale(1)" : "scale(0.5)",
          }}
        >
          {totalVolumeKg.toLocaleString()} kg
        </div>
        <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>
          lifted today
        </p>

        {/* Rank title */}
        {step >= 1 && (
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div
              className="text-3xl font-bold tracking-wide mb-1"
              style={{ color: "#fbbf24" }}
            >
              ⚔️ {rank.title.toUpperCase()} ⚔️
            </div>
            <div className="text-sm" style={{ color: "#d1d5db" }}>
              {rank.emoji} {rank.line}
            </div>
            <div className="text-xs mt-1" style={{ color: "#6b7280" }}>
              {rank.universe}
            </div>
          </div>
        )}

        {/* XP bar */}
        {step >= 2 && (
          <div className="w-full mb-6 animate-in fade-in duration-500">
            <div className="flex justify-between text-xs mb-1" style={{ color: "#9ca3af" }}>
              <span>{levelInfo.title} — Level {newLevel}</span>
              <span>+{xpEarned} XP</span>
            </div>
            <div
              className="w-full h-3 rounded-full overflow-hidden"
              style={{ background: "#1f2937" }}
            >
              <div
                className="h-3 rounded-full transition-all duration-1000"
                style={{
                  background: "linear-gradient(90deg, #16a34a, #4ade80)",
                  width: "65%",
                }}
              />
            </div>
            {leveledUp && (
              <div
                className="mt-2 text-sm font-bold"
                style={{ color: "#fbbf24" }}
              >
                🎉 LEVEL UP! {oldLevel} → {newLevel}
              </div>
            )}
          </div>
        )}

        {/* New badges */}
        {step >= 3 && newBadges.length > 0 && (
          <div className="w-full mb-6 animate-in fade-in duration-500">
            {newBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 rounded-xl px-4 py-3 mb-2"
                style={{ background: "#1f2937", border: "1px solid #fbbf24" }}
              >
                <span className="text-2xl">{badge.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-bold" style={{ color: "#fbbf24" }}>
                    🏆 {badge.name}
                  </div>
                  <div className="text-xs" style={{ color: "#9ca3af" }}>
                    {badge.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Streak */}
        {step >= 3 && (
          <div className="mb-8" style={{ color: "#f97316" }}>
            🔥 {streak} day streak
          </div>
        )}

        {/* Continue button */}
        {step >= 4 && (
          <button
            onClick={finish}
            className="w-full py-3 rounded-xl font-bold text-white animate-in fade-in duration-500"
            style={{ background: "#16a34a" }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
