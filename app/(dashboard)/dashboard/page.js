import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatDuration, calculateVolume } from "@/lib/utils";
import { getAlltimeRank, getLevelTitle } from "@/constants/ranks";
import XPBar from "@/components/gamification/XPBar";
import StreakHeatmap from "@/components/gamification/StreakHeatmap";
import AvatarRenderer from "@/components/avatar/AvatarRenderer";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId  = session.user.id;

  const [user, stats, activePlan, recentSessions, badges] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userStats.findUnique({ where: { userId } }),
    prisma.workoutPlan.findFirst({ where: { userId, isActive: true } }),
    prisma.workoutSession.findMany({
      where:   { userId },
      include: { logs: true },
      orderBy: { startedAt: "desc" },
      take:    30,
    }),
    prisma.userBadge.findMany({
      where:   { userId },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
      take:    3,
    }),
  ]);

  const avatarData    = user?.avatarData ? JSON.parse(user.avatarData) : null;
  const alltimeRank   = getAlltimeRank(stats?.totalVolumeKg ?? 0);
  const levelTitle    = getLevelTitle(stats?.level ?? 1);
  const recentFive    = recentSessions.slice(0, 5);
  const needsOnboard  = !user?.goal;

  if (needsOnboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-5xl mb-4">⚔️</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Welcome, young Padawan
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Complete your training setup first, you must.
        </p>
        <Link
          href="/onboarding"
          className="px-6 py-3 rounded-xl font-bold text-white"
          style={{ background: "var(--accent)" }}
        >
          Begin Onboarding →
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AvatarRenderer avatarData={avatarData} level={stats?.level ?? 1} size={48} />
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              Hey {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {alltimeRank.title} · {alltimeRank.universe}
            </p>
          </div>
        </div>
        {stats?.currentStreak > 0 && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold"
            style={{ background: "#fff7ed", color: "#c2410c" }}
          >
            🔥 {stats.currentStreak} day streak
          </div>
        )}
      </div>

      {/* XP bar */}
      {stats && (
        <div
          className="rounded-xl p-4 mb-4"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
        >
          <XPBar xp={stats.xp} level={stats.level} />
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total sessions",  value: stats?.totalSessions ?? 0 },
          { label: "Total volume",    value: `${((stats?.totalVolumeKg ?? 0) / 1000).toFixed(1)}t` },
          { label: "Longest streak",  value: `${stats?.longestStreak ?? 0} days` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs mb-1 uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
              {label}
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Active plan + recent badges */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Active plan */}
        <div
          className="rounded-xl p-4"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "var(--text-secondary)" }}>
            Active plan
          </p>
          {activePlan ? (
            <>
              <p className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                {activePlan.title}
              </p>
              <Link
                href="/workout"
                className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                style={{ background: "var(--accent)" }}
              >
                Start today's workout →
              </Link>
            </>
          ) : (
            <Link href="/workout" className="text-sm" style={{ color: "var(--accent)" }}>
              Generate a plan →
            </Link>
          )}
        </div>

        {/* Recent badges */}
        <div
          className="rounded-xl p-4"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "var(--text-secondary)" }}>
            Recent badges
          </p>
          {badges.length > 0 ? (
            <div className="flex gap-2">
              {badges.map((ub) => (
                <div key={ub.id} title={ub.badge.name} className="text-2xl cursor-default">
                  {ub.badge.icon}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Complete a workout to earn badges
            </p>
          )}
        </div>
      </div>

      {/* Streak heatmap */}
      <div
        className="rounded-xl p-5 mb-4"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Training history
        </p>
        <StreakHeatmap sessions={recentSessions} />
      </div>

      {/* Recent sessions */}
      <div
        className="rounded-xl"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            Recent sessions
          </p>
        </div>
        {recentFive.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              No sessions yet. Start your first workout!
            </p>
          </div>
        ) : (
          recentFive.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between px-4 py-3 border-b last:border-0"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {s.dayLabel}
                </p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {new Date(s.startedAt).toLocaleDateString()} · {formatDuration(s.durationMins)}
                </p>
              </div>
              <span
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ background: "var(--accent-light)", color: "var(--accent-text)" }}
              >
                {(s.totalVolumeKg ?? calculateVolume(s.logs)).toFixed(0)} kg
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
