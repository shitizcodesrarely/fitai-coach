"use client";
import { useState, useEffect } from "react";
import { getRandomIdleQuote } from "@/constants/yoda";

// Pixel art Yoda — SVG sprite, mood-based animations
// Moods: idle | walking | meditating | happy | sad | thinking
export default function MasterYoda({
  mood = "idle",
  quote = null,
  size = 80,
  onClick,
  showBubble = true,
}) {
  const [currentQuote, setCurrentQuote] = useState(quote);
  const [bubbleVisible, setBubbleVisible] = useState(!!quote);

  useEffect(() => {
    setCurrentQuote(quote);
    setBubbleVisible(!!quote);
  }, [quote]);

  function handleClick() {
    if (onClick) { onClick(); return; }
    const q = getRandomIdleQuote();
    setCurrentQuote(q);
    setBubbleVisible(true);
    setTimeout(() => setBubbleVisible(false), 4000);
  }

  return (
    <div
      className="relative inline-flex flex-col items-center cursor-pointer select-none"
      onClick={handleClick}
      style={{ width: size }}
    >
      {/* Speech bubble */}
      {showBubble && bubbleVisible && currentQuote && (
        <div
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50"
          style={{ width: 180 }}
        >
          <div
            className="rounded-xl px-3 py-2 text-xs leading-relaxed shadow-lg"
            style={{
              background: "var(--bg-primary, #fff)",
              border: "1.5px solid var(--border, #e5e7eb)",
              color: "var(--text-primary, #111827)",
              fontStyle: "italic",
            }}
          >
            "{currentQuote}"
            {/* Bubble tail */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full"
              style={{
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid var(--border, #e5e7eb)",
              }}
            />
          </div>
        </div>
      )}

      {/* Pixel art Yoda SVG */}
      <svg
        width={size}
        height={size * 1.4}
        viewBox="0 0 32 45"
        style={{
          imageRendering: "pixelated",
          animation: getMoodAnimation(mood),
        }}
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Master Yoda — ${mood}`}
      >
        {/* Robe/body */}
        <rect x="10" y="22" width="12" height="14" fill="#4a5e3a" />
        <rect x="8"  y="24" width="3"  height="10" fill="#3d4f30" />
        <rect x="21" y="24" width="3"  height="10" fill="#3d4f30" />

        {/* Legs */}
        <rect x="11" y="34" width="4" height="6" fill="#3d4f30" />
        <rect x="17" y="34" width="4" height="6" fill="#3d4f30" />
        <rect x="10" y="39" width="5" height="2" fill="#2a3020" />
        <rect x="17" y="39" width="5" height="2" fill="#2a3020" />

        {/* Staff */}
        <rect x="6"  y="20" width="2" height="20" fill="#8b6914" />
        <rect x="5"  y="19" width="4" height="2"  fill="#6b5010" />

        {/* Neck */}
        <rect x="14" y="19" width="4" height="4" fill="#7ab368" />

        {/* Head */}
        <rect x="10" y="10" width="12" height="11" rx="1" fill="#7ab368" />

        {/* Ears — big Yoda ears */}
        <rect x="4"  y="12" width="7"  height="4" rx="1" fill="#7ab368" />
        <rect x="21" y="12" width="7"  height="4" rx="1" fill="#7ab368" />
        <rect x="4"  y="13" width="6"  height="2" fill="#5a9050" />
        <rect x="22" y="13" width="6"  height="2" fill="#5a9050" />

        {/* Eyes */}
        {mood === "sad" ? (
          <>
            <rect x="13" y="15" width="2" height="2" fill="#1a1a1a" />
            <rect x="17" y="15" width="2" height="2" fill="#1a1a1a" />
            {/* Sad eyebrows */}
            <rect x="12" y="13" width="4" height="1" fill="#3d6b30" transform="rotate(10 14 13)" />
            <rect x="16" y="13" width="4" height="1" fill="#3d6b30" transform="rotate(-10 18 13)" />
          </>
        ) : mood === "happy" ? (
          <>
            <rect x="13" y="14" width="2" height="3" fill="#1a1a1a" />
            <rect x="17" y="14" width="2" height="3" fill="#1a1a1a" />
            {/* Happy eye shine */}
            <rect x="14" y="14" width="1" height="1" fill="#ffffff" />
            <rect x="18" y="14" width="1" height="1" fill="#ffffff" />
          </>
        ) : (
          <>
            <rect x="13" y="14" width="2" height="2" fill="#1a1a1a" />
            <rect x="17" y="14" width="2" height="2" fill="#1a1a1a" />
          </>
        )}

        {/* Nose */}
        <rect x="15" y="17" width="2" height="1" fill="#5a9050" />

        {/* Mouth */}
        {mood === "happy" ? (
          <>
            <rect x="13" y="19" width="6" height="1" fill="#3d6b30" />
            <rect x="12" y="18" width="2" height="1" fill="#3d6b30" />
            <rect x="18" y="18" width="2" height="1" fill="#3d6b30" />
          </>
        ) : mood === "sad" ? (
          <>
            <rect x="13" y="19" width="6" height="1" fill="#3d6b30" />
            <rect x="12" y="20" width="2" height="1" fill="#3d6b30" />
            <rect x="18" y="20" width="2" height="1" fill="#3d6b30" />
          </>
        ) : (
          <rect x="13" y="19" width="6" height="1" fill="#3d6b30" />
        )}

        {/* Wrinkles */}
        <rect x="11" y="12" width="3" height="1" fill="#5a9050" />
        <rect x="18" y="12" width="3" height="1" fill="#5a9050" />

        {/* Hair wisps */}
        <rect x="10" y="9"  width="2" height="2" fill="#c8b89a" />
        <rect x="20" y="9"  width="2" height="2" fill="#c8b89a" />
        <rect x="14" y="8"  width="4" height="2" fill="#c8b89a" />

        {/* Meditation glow when meditating */}
        {mood === "meditating" && (
          <>
            <rect x="9"  y="10" width="1" height="1" fill="#a8d8ff" opacity="0.6" />
            <rect x="22" y="10" width="1" height="1" fill="#a8d8ff" opacity="0.6" />
            <rect x="15" y="7"  width="2" height="1" fill="#a8d8ff" opacity="0.6" />
          </>
        )}
      </svg>

      {/* Mood label for accessibility */}
      <span className="sr-only">Master Yoda, {mood}</span>
    </div>
  );
}

function getMoodAnimation(mood) {
  switch (mood) {
    case "idle":        return "yoda-breathe 3s ease-in-out infinite";
    case "happy":       return "yoda-bounce 0.5s ease-in-out infinite";
    case "sad":         return "yoda-droop 2s ease-in-out infinite";
    case "meditating":  return "yoda-float 4s ease-in-out infinite";
    case "walking":     return "yoda-walk 1s steps(2) infinite";
    case "thinking":    return "yoda-breathe 2s ease-in-out infinite";
    default:            return "none";
  }
}
