"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import AvatarRenderer from "@/components/avatar/AvatarRenderer";

const NAV = [
  { href: "/dashboard",    label: "Dashboard",   icon: "🏠" },
  { href: "/workout",      label: "Workout",      icon: "💪" },
  { href: "/progress",     label: "Progress",     icon: "📈" },
  { href: "/formcheck",    label: "Form Check",   icon: "🎥" },
  { href: "/leaderboard",  label: "Leaderboard",  icon: "⚔️" },
  { href: "/profile",      label: "Profile",      icon: "👤" },
];

export default function Sidebar({ user, stats }) {
  const pathname = usePathname();
  const avatarData = user?.avatarData ? JSON.parse(user.avatarData) : null;

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-56 flex flex-col z-10"
      style={{
        background:   "var(--sidebar-bg)",
        borderRight:  "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🏋️</span>
          <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
            FitAI Coach
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: active ? "var(--accent-light)" : "transparent",
                color:      active ? "var(--accent-text)"  : "var(--text-secondary)",
              }}
            >
              <span>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
        {/* XP bar mini */}
        {stats && (
          <div className="mb-3 px-1">
            <div className="flex justify-between text-xs mb-1"
              style={{ color: "var(--text-secondary)" }}>
              <span>Level {stats.level}</span>
              <span>{stats.xp} XP</span>
            </div>
            <div className="w-full h-1 rounded-full" style={{ background: "var(--bg-tertiary)" }}>
              <div
                className="h-1 rounded-full"
                style={{
                  width:      "45%",
                  background: "var(--accent)",
                }}
              />
            </div>
          </div>
        )}

        {/* User row */}
        <div className="flex items-center gap-2 mb-2">
          <AvatarRenderer avatarData={avatarData} level={stats?.level ?? 1} size={32} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
              {user?.name}
            </p>
            {stats?.currentStreak > 0 && (
              <p className="text-xs" style={{ color: "#f97316" }}>
                🔥 {stats.currentStreak} day streak
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs w-full text-left px-1 transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
