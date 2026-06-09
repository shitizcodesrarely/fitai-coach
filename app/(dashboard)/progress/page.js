import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import ProgressCharts from "@/components/progress/ProgressCharts";

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);
  const userId  = session.user.id;

  const [sessions, bodyMetrics] = await Promise.all([
    prisma.workoutSession.findMany({
      where:   { userId },
      include: { logs: true },
      orderBy: { startedAt: "asc" },
      take:    60,
    }),
    prisma.bodyMetric.findMany({
      where:   { userId },
      orderBy: { loggedAt: "asc" },
      take:    60,
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
        Progress
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Track your gains over time
      </p>
      <ProgressCharts sessions={sessions} bodyMetrics={bodyMetrics} />
    </div>
  );
}
