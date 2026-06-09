"use client";
import { useState, useEffect } from "react";
import AvatarRenderer from "@/components/avatar/AvatarRenderer";
import { getLevelTitle } from "@/constants/ranks";

const TABS = [
  { key: "weekly",  label: "This Week" },
  { key: "alltime", label: "All Time"  },
  { key: "levels",  label: "Levels"    },
];

export default function LeaderboardPage() {
  const [tab, setTab]         = useState("weekly");
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail]     = useState("");
  const [adding, setAdding]   = useState(false);
  const [addMsg, setAddMsg]   = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?type=${tab}`)
      .then((r) => r.json())
      .then((d) => { setData(d.leaderboard ?? []); setLoading(false); });
  }, [tab]);

  async function addFriend(e) {
    e.preventDefault();
    setAdding(true);
    setAddMsg("");
    const res  = await fetch("/api/leaderboard", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ friendEmail: email }),
    });
    const json = await res.json();
    setAddMsg(res.ok ? `Added ${json.friend?.name}!` : json.error);
    setAdding(false);
    if (res.ok) setEmail("");
  }

  function getMetric(entry) {
    if (tab === "weekly")  return `${(entry.weeklyVolume ?? 0).toFixed(0)} kg`;
    if (tab === "alltime") return `${(entry.totalVolume  ?? 0).toFixed(0)} kg`;
    return `Level ${entry.level}`;
  }

  const MEDAL = ["🥇", "🥈", "🥉"];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
        Leaderboard
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Compete with your friends, young Padawan
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={{
              background: tab === t.key ? "var(--accent)"      : "var(--bg-secondary)",
              color:      tab === t.key ? "#fff"               : "var(--text-secondary)",
              border:     `1px solid ${tab === t.key ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Add friend */}
      <form onSubmit={addFriend} className="flex gap-2 mb-6">
        <input
          type="email"
          placeholder="Friend's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none"
          style={{
            background: "var(--bg-secondary)",
            border:     "1px solid var(--border)",
            color:      "var(--text-primary)",
          }}
        />
        <button
          type="submit"
          disabled={adding || !email}
          className="px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50"
          style={{ background: "var(--accent)" }}
        >
          {adding ? "..." : "Add"}
        </button>
      </form>
      {addMsg && (
        <p className="text-sm mb-4" style={{ color: "var(--accent)" }}>{addMsg}</p>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-12" style={{ color: "var(--text-secondary)" }}>
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div
          className="rounded-xl p-10 text-center"
          style={{ background: "var(--bg-secondary)" }}
        >
          <p className="text-4xl mb-3">⚔️</p>
          <p className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>
            No warriors yet
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Add friends by email to compare your strength
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {data.map((entry, i) => {
            const levelInfo = getLevelTitle(entry.level);
            return (
              <div
                key={entry.userId}
                className="flex items-center gap-3 px-4 py-3 border-b last:border-0"
                style={{
                  borderColor: "var(--border)",
                  background:  entry.isYou ? "var(--accent-light)" : "var(--bg-primary)",
                }}
              >
                <div className="w-8 text-center font-bold text-lg">
                  {i < 3 ? MEDAL[i] : `#${i + 1}`}
                </div>
                <AvatarRenderer
                  avatarData={entry.avatarData}
                  level={entry.level}
                  size={36}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {entry.name}
                    </span>
                    {entry.isYou && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--accent)", color: "#fff" }}
                      >
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {levelInfo.title} · 🔥 {entry.streak} days
                  </div>
                </div>
                <div className="text-sm font-bold" style={{ color: "var(--accent)" }}>
                  {getMetric(entry)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
