"use client";
import { getAvatarUpgrade } from "@/constants/avatars";
import { FITNESS_LEGENDS } from "@/constants/avatars";

// Renders the user's pixel art avatar based on their avatarData
export default function AvatarRenderer({ avatarData, level = 1, size = 64 }) {
  const data   = typeof avatarData === "string" ? JSON.parse(avatarData) : avatarData;
  const upgrade = getAvatarUpgrade(level);

  if (!data) return <DefaultAvatar size={size} />;

  if (data.type === "legend") {
    return <LegendAvatar legendId={data.name} size={size} />;
  }

  return <CustomAvatar data={data} upgrade={upgrade} size={size} />;
}

function DefaultAvatar({ size }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold"
      style={{
        width:      size,
        height:     size,
        background: "var(--accent-light)",
        color:      "var(--accent-text)",
        fontSize:   size * 0.4,
      }}
    >
      ?
    </div>
  );
}

function LegendAvatar({ legendId, size }) {
  // Find legend info
  const allLegends = [
    ...FITNESS_LEGENDS.oldSchool,
    ...FITNESS_LEGENDS.newSchool,
  ];
  const legend = allLegends.find((l) => l.id === legendId);

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold"
      style={{
        width:      size,
        height:     size,
        background: "#1f2937",
        fontSize:   size * 0.5,
      }}
      title={legend?.name}
    >
      {legend?.icon ?? "💪"}
    </div>
  );
}

// Pixel art character — built from SVG rectangles
function CustomAvatar({ data, upgrade, size }) {
  const scale = size / 32;

  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 32 48"
      style={{ imageRendering: "pixelated" }}
      aria-label="Your avatar"
    >
      {/* Body — colored by outfit */}
      <rect x="11" y="24" width="10" height="12"
        fill={getOutfitColor(data.outfitTop)} />

      {/* Arms */}
      <rect x="8"  y="25" width="3" height="8"
        fill={getOutfitColor(data.outfitTop)} />
      <rect x="21" y="25" width="3" height="8"
        fill={getOutfitColor(data.outfitTop)} />

      {/* Hands */}
      <rect x="7"  y="32" width="3" height="3" fill={data.skinTone} />
      <rect x="22" y="32" width="3" height="3" fill={data.skinTone} />

      {/* Legs */}
      <rect x="11" y="36" width="4" height="8"
        fill={getBottomColor(data.outfitBottom)} />
      <rect x="17" y="36" width="4" height="8"
        fill={getBottomColor(data.outfitBottom)} />

      {/* Shoes */}
      <rect x="10" y="43" width="5" height="2" fill="#2a2a2a" />
      <rect x="17" y="43" width="5" height="2" fill="#2a2a2a" />

      {/* Neck */}
      <rect x="14" y="21" width="4" height="4" fill={data.skinTone} />

      {/* Head */}
      <rect x="10" y="10" width="12" height="12" rx="1" fill={data.skinTone} />

      {/* Hair */}
      <rect x="10" y="9"  width="12" height="3"
        fill={getHairColor(data.hair)} />
      {data.hair === "mohawk" && (
        <rect x="14" y="7" width="4" height="3" fill={getHairColor(data.hair)} />
      )}
      {data.hair === "bald" && null}

      {/* Eyes */}
      <rect x="12" y="14" width="3" height="3" fill="#fff" />
      <rect x="17" y="14" width="3" height="3" fill="#fff" />
      <rect x="13" y="15" width="2" height="2" fill="#1a1a1a" />
      <rect x="18" y="15" width="2" height="2" fill="#1a1a1a" />

      {/* Beard if applicable */}
      {data.beard !== "clean" && (
        <rect x="11" y="20" width="10" height="3"
          fill={getHairColor(data.hair)} opacity="0.8" />
      )}

      {/* Accessory */}
      {data.accessory === "headband" && (
        <rect x="10" y="10" width="12" height="2" fill="#ef4444" />
      )}
      {data.accessory === "headphones" && (
        <>
          <rect x="8"  y="12" width="3" height="5" fill="#374151" />
          <rect x="21" y="12" width="3" height="5" fill="#374151" />
          <rect x="10" y="9"  width="12" height="2" fill="#1f2937" />
        </>
      )}

      {/* Level upgrade glow effect */}
      {upgrade.minLevel >= 36 && (
        <>
          <rect x="9"  y="9"  width="1" height="1" fill="#fbbf24" opacity="0.8" />
          <rect x="22" y="9"  width="1" height="1" fill="#fbbf24" opacity="0.8" />
          <rect x="16" y="7"  width="2" height="1" fill="#fbbf24" opacity="0.8" />
        </>
      )}
    </svg>
  );
}

function getOutfitColor(top) {
  const colors = {
    tank:        "#4b5563",
    hoodie:      "#374151",
    compression: "#1e3a5f",
    noshirt:     "transparent",
  };
  return colors[top] ?? "#4b5563";
}

function getBottomColor(bottom) {
  const colors = {
    joggers: "#374151",
    shorts:  "#1e3a5f",
    tights:  "#111827",
  };
  return colors[bottom] ?? "#374151";
}

function getHairColor(hair) {
  // Default brown — in future let user pick hair color too
  return "#4a3520";
}
