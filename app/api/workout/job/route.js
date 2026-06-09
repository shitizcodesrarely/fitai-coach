import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { workoutPlanQueue } from "@/lib/queue";
import { prisma } from "@/lib/db";

// GET /api/workout/job?jobId=xxx
// Frontend polls this every 3 seconds while the AI plan is being generated.
// Returns: { status: "waiting" | "active" | "completed" | "failed", plan: {...} }
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "jobId required" }, { status: 400 });
  }

  const job = await workoutPlanQueue.getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const state = await job.getState(); // "waiting" | "active" | "completed" | "failed"

  if (state === "completed") {
    // Fetch the freshly created plan from DB
    const plan = await prisma.workoutPlan.findFirst({
      where:   { userId: session.user.id, isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ status: "completed", plan });
  }

  if (state === "failed") {
    return NextResponse.json({ status: "failed", error: "Plan generation failed. Please try again." });
  }

  return NextResponse.json({ status: state }); // "waiting" or "active"
}
