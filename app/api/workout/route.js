import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { workoutPlanQueue } from "@/lib/queue";

const generateSchema = z.object({
  age:         z.number().min(13).max(80),
  weightKg:    z.number().min(30).max(300),
  heightCm:    z.number().min(100).max(250),
  goal:        z.enum(["BULK", "CUT", "MAINTAIN", "STRENGTH", "ENDURANCE"]),
  experience:  z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  daysPerWeek: z.number().min(2).max(6),
  equipment:   z.string(),
});

// GET /api/workout — fetch the user's active workout plan
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const plan = await prisma.workoutPlan.findFirst({
    where: { userId: session.user.id, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ plan });
}

// POST /api/workout — queue a new AI workout plan generation
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const profile = generateSchema.parse(body);

    // Save profile to user record
    await prisma.user.update({
      where: { id: session.user.id },
      data: profile,
    });

    // Deactivate old plans
    await prisma.workoutPlan.updateMany({
      where: { userId: session.user.id },
      data: { isActive: false },
    });

    // Add job to queue — response returns immediately
    // Worker picks this up and calls Claude, then saves to DB
    const job = await workoutPlanQueue.add("generate", {
      userId: session.user.id,
      profile,
    });

    return NextResponse.json({ jobId: job.id, status: "queued" }, { status: 202 });
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Workout plan error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
