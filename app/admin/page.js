"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin").then((r) => r.json()).then((d) => { setStats(d); setLoading(false); });
    const interval = setInterval(() => {
      fetch("/api/admin").then((r) => r.json()).then(setStats);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <p style={{ color: "var(--text-secondary)" }}>Loading system stats...</p>
    </div>
  );

  const sections = [
    { title: "📊 Database",   color: "#3b82f6", items: [
      { label: "Total users",        value: stats.database?.totalUsers },
      { label: "Total sessions",     value: stats.database?.totalSessions },
      { label: "Form checks",        value: stats.database?.totalFormChecks },
      { label: "Pending checks",     value: stats.database?.pendingFormChecks },
      { label: "Sessions (24h)",     value: stats.database?.sessionsLast24h },
    ]},
    { title: "⚡ Job Queues", color: "#f97316", items: [
      { label: "Workout plan queue", value: stats.queues?.workoutPlan },
      { label: "Form check queue",   value: stats.queues?.formCheck },
      { label: "Weekly report queue",value: stats.queues?.weeklyReport },
    ]},
    { title: "🖥️ Server",    color: "#16a34a", items: [
      { label: "Uptime",      value: `${Math.floor((stats.server?.uptime ?? 0)/60)}m` },
      { label: "Node.js",     value: stats.server?.nodeVersion },
      { label: "Memory",      value: `${stats.server?.memoryMB} MB` },
      { label: "Environment", value: stats.server?.environment },
    ]},
  ];

  return (
    <div className="min-h-screen p-8" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>System Health</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Auto-refreshes every 30s</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: "#dcfce7", color: "#15803d" }}>
            <span className="w-2 h-2 rounded-full bg-green-500" style={{ animation: "pulse 2s infinite" }} />
            Live
          </div>
        </div>
        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="rounded-xl p-6"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
              <h2 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>{s.title}</h2>
              <div className="grid grid-cols-2 gap-3">
                {s.items.map((item) => (
                  <div key={item.label} className="rounded-lg p-3" style={{ background: "var(--bg-primary)" }}>
                    <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{item.label}</p>
                    <p className="text-xl font-bold" style={{ color: s.color }}>{item.value ?? "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
