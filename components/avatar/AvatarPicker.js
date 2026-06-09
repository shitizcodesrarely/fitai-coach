"use client";
import { useState } from "react";
import {
  BODY_TYPES, SKIN_TONES, HAIR_STYLES,
  BEARD_STYLES, OUTFIT_TOPS, OUTFIT_BOTTOMS,
  ACCESSORIES, FITNESS_LEGENDS, getDefaultAvatarData,
} from "@/constants/avatars";
import AvatarRenderer from "./AvatarRenderer";

const TABS = ["Custom", "Legends", "Upload"];

export default function AvatarPicker({ onSelect, onSkip, currentLevel = 1 }) {
  const [tab, setTab]           = useState("Custom");
  const [legendTab, setLegendTab] = useState("oldSchool");
  const [avatarData, setAvatarData] = useState(getDefaultAvatarData());

  function updateField(field, value) {
    setAvatarData((prev) => ({ ...prev, [field]: value }));
  }

  function selectLegend(id) {
    const data = { type: "legend", name: id };
    onSelect?.(data);
  }

  function confirmCustom() {
    onSelect?.(avatarData);
  }

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={{
              background: tab === t ? "var(--accent)"      : "var(--bg-secondary)",
              color:      tab === t ? "#fff"               : "var(--text-secondary)",
              border:     `1px solid ${tab === t ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Custom avatar builder */}
      {tab === "Custom" && (
        <div className="flex gap-4">
          {/* Preview */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <AvatarRenderer avatarData={avatarData} level={currentLevel} size={80} />
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Preview
            </span>
          </div>

          {/* Controls */}
          <div className="flex-1 space-y-3 overflow-y-auto max-h-64">
            {/* Body type */}
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Body Type</p>
              <div className="flex gap-1 flex-wrap">
                {BODY_TYPES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => updateField("bodyType", b.id)}
                    className="px-2 py-1 rounded text-xs transition-colors"
                    style={{
                      background: avatarData.bodyType === b.id ? "var(--accent)" : "var(--bg-secondary)",
                      color:      avatarData.bodyType === b.id ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin tone */}
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Skin Tone</p>
              <div className="flex gap-1.5 flex-wrap">
                {SKIN_TONES.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => updateField("skinTone", tone)}
                    className="rounded-full transition-transform"
                    style={{
                      width:   22, height: 22,
                      background: tone,
                      border: avatarData.skinTone === tone ? "2px solid var(--accent)" : "2px solid transparent",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Hair */}
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Hair</p>
              <div className="flex gap-1 flex-wrap">
                {HAIR_STYLES.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => updateField("hair", h.id)}
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      background: avatarData.hair === h.id ? "var(--accent)" : "var(--bg-secondary)",
                      color:      avatarData.hair === h.id ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    {h.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Outfit top */}
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Top</p>
              <div className="flex gap-1 flex-wrap">
                {OUTFIT_TOPS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => updateField("outfitTop", o.id)}
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      background: avatarData.outfitTop === o.id ? "var(--accent)" : "var(--bg-secondary)",
                      color:      avatarData.outfitTop === o.id ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    {o.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessory */}
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Accessory</p>
              <div className="flex gap-1 flex-wrap">
                {ACCESSORIES.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => updateField("accessory", a.id)}
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      background: avatarData.accessory === a.id ? "var(--accent)" : "var(--bg-secondary)",
                      color:      avatarData.accessory === a.id ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legends picker */}
      {tab === "Legends" && (
        <div>
          <div className="flex gap-2 mb-3">
            {["oldSchool", "newSchool"].map((t) => (
              <button
                key={t}
                onClick={() => setLegendTab(t)}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: legendTab === t ? "var(--accent)" : "var(--bg-secondary)",
                  color:      legendTab === t ? "#fff" : "var(--text-secondary)",
                }}
              >
                {t === "oldSchool" ? "Old School" : "New School"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {FITNESS_LEGENDS[legendTab].map((legend) => (
              <button
                key={legend.id}
                onClick={() => selectLegend(legend.id)}
                className="flex flex-col items-center p-2 rounded-xl text-center transition-all"
                style={{
                  background: "var(--bg-secondary)",
                  border:     "1px solid var(--border)",
                }}
              >
                <span className="text-2xl mb-1">{legend.icon}</span>
                <span className="text-xs leading-tight" style={{ color: "var(--text-primary)" }}>
                  {legend.name.split(" ")[0]}
                </span>
                <span className="text-xs" style={{ color: "var(--text-secondary)", fontSize: 10 }}>
                  {legend.era}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload */}
      {tab === "Upload" && (
        <div className="flex flex-col items-center py-6 gap-3">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
            style={{ background: "var(--bg-secondary)", border: "2px dashed var(--border)" }}
          >
            📷
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Upload your own photo
          </p>
          <input
            type="file"
            accept="image/*"
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
            onChange={(e) => {
              // In production: upload to S3, get URL, save as avatarData
              const file = e.target.files?.[0];
              if (file) onSelect?.({ type: "upload", fileName: file.name });
            }}
          />
        </div>
      )}

      {/* Action buttons */}
      {tab === "Custom" && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={confirmCustom}
            className="flex-1 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: "var(--accent)" }}
          >
            Save avatar
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-2 rounded-xl text-sm"
            style={{ color: "var(--text-secondary)", background: "var(--bg-secondary)" }}
          >
            Skip
          </button>
        </div>
      )}

      {tab !== "Custom" && (
        <button
          onClick={onSkip}
          className="mt-4 text-sm w-full text-center"
          style={{ color: "var(--text-secondary)" }}
        >
          Skip for now, I will choose later
        </button>
      )}
    </div>
  );
}
