import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

// GET /api/admin - system health overview
// Returns queue depth, user counts, recent errors, cache stats
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  try {
    // Database stats
    const [
      totalUsers,
      totalSessions,
      totalFormChecks,
      pendingFormChecks,
      recentSessions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.workoutSession.count(),
      prisma.formCheck.count(),
      prisma.formCheck.count({ where: { status: "PENDING" } }),
      prisma.workoutSession.count({
        where: {
          startedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    // Queue stats (Redis) - gracefully handle if Redis not available
    let queueStats = { workoutPlan: 0, formCheck: 0, weeklyReport: 0 };
    try {
      const { workoutPlanQueue, formCheckQueue, weeklyReportQueue } = await import("@/lib/queue");
      const [wp, fc, wr] = await Promise.all([
        workoutPlanQueue.getWaitingCount(),
        formCheckQueue.getWaitingCount(),
        weeklyReportQueue.getWaitingCount(),
      ]);
      queueStats = { workoutPlan: wp, formCheck: fc, weeklyReport: wr };
    } catch {
      // Redis not available in dev — show zeros
    }

    return NextResponse.json({
      database: {
        totalUsers,
        totalSessions,
        totalFormChecks,
        pendingFormChecks,
        sessionsLast24h: recentSessions,
      },
      queues: queueStats,
      server: {
        uptime:      Math.floor(process.uptime()),
        nodeVersion: process.version,
        memoryMB:    Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        environment: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
