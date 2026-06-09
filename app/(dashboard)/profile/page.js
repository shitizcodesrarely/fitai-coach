import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { calculateBMI } from "@/lib/utils";
import { getAlltimeRank, getLevelTitle } from "@/constants/ranks";
import XPBar from "@/components/gamification/XPBar";
import BadgesGrid from "@/components/gamification/BadgesGrid";
import StreakHeatmap from "@/components/gamification/StreakHeatmap";
import ThemeSwitcher from "@/components/themes/ThemeSwitcher";
import AvatarRenderer from "@/components/avatar/AvatarRenderer";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userId  = session.user.id;

  const [user, stats, badges, sessions] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userStats.findUnique({ where: { userId } }),
    prisma.userBadge.findMany({
      where:   { userId },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    }),
    prisma.workoutSession.findMany({
      where:   { userId },
      orderBy: { startedAt: "asc" },
    }),
  ]);

  const avatarData  = user?.avatarData ? JSON.parse(user.avatarData) : null;
  const bmi         = user?.weightKg && user?.heightCm
    ? calculateBMI(user.weightKg, user.heightCm) : null;
  const alltimeRank = getAlltimeRank(stats?.totalVolumeKg ?? 0);
  const levelTitle  = getLevelTitle(stats?.level ?? 1);

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header card */}
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-4 mb-4">
          <AvatarRenderer avatarData={avatarData} level={stats?.level ?? 1} size={64} />
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              {user?.name}
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {user?.email}
            </p>
            <div className="flex gap-2 mt-1">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: "var(--accent-light)", color: "var(--accent-text)" }}
              >
                {levelTitle.title}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: "#fef9c3", color: "#854d0e" }}
              >
                {alltimeRank.title}
              </span>
            </div>
          </div>
        </div>

        {/* XP bar */}
        {stats && <XPBar xp={stats.xp} level={stats.level} />}
      </div>

      {/* Stats grid */}
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        <p className="text-xs uppercase tracking-wide mb-3" style={{ color: "var(--text-secondary)" }}>
          Your stats
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Goal",          value: user?.goal?.toLowerCase()        },
            { label: "Experience",    value: user?.experience?.toLowerCase()  },
            { label: "Days/week",     value: user?.daysPerWeek                },
            { label: "Weight",        value: user?.weightKg ? `${user.weightKg}kg` : "—" },
            { label: "Height",        value: user?.heightCm ? `${user.heightCm}cm` : "—" },
            { label: "BMI",           value: bmi ?? "—"                       },
            { label: "Total volume",  value: `${((stats?.totalVolumeKg ?? 0)/1000).toFixed(1)}t` },
            { label: "Sessions",      value: stats?.totalSessions ?? 0        },
            { label: "Best streak",   value: `${stats?.longestStreak ?? 0}d`  },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg p-3"
              style={{ background: "var(--bg-secondary)" }}
            >
              <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{label}</p>
              <p className="text-sm font-semibold capitalize" style={{ color: "var(--text-primary)" }}>
                {value ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* All-time rank */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "var(--card-bg)",
          border:     "1px solid var(--border)",
        }}
      >
        <p className="text-xs uppercase tracking-wide mb-3" style={{ color: "var(--text-secondary)" }}>
          All-time rank
        </p>
        <div className="flex items-center gap-3">
          <div className="text-4xl">⚔️</div>
          <div>
            <p className="text-xl font-bold" style={{ color: "var(--accent)" }}>
              {alltimeRank.title}
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {alltimeRank.universe} · {alltimeRank.flavour}
            </p>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        <p className="text-xs uppercase tracking-wide mb-3" style={{ color: "var(--text-secondary)" }}>
          Training history
        </p>
        <StreakHeatmap sessions={sessions} />
      </div>

      {/* Badges */}
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        <p className="text-xs uppercase tracking-wide mb-3" style={{ color: "var(--text-secondary)" }}>
          Badges — {badges.length} earned
        </p>
        <BadgesGrid earnedBadges={badges} />
      </div>

      {/* Theme switcher */}
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        <ThemeSwitcher />
      </div>
    </div>
  );
}
