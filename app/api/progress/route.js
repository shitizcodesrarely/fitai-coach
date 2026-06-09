import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

const sessionSchema = z.object({
  planId:      z.string().optional(),
  dayLabel:    z.string(),
  durationMins: z.number().optional(),
  notes:       z.string().optional(),
  logs: z.array(
    z.object({
      exercise:  z.string(),
      setNumber: z.number(),
      reps:      z.number(),
      weightKg:  z.number(),
      rpe:       z.number().min(1).max(10).optional(),
    })
  ),
});

// GET /api/progress — fetch user's session history
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const sessions = await prisma.workoutSession.findMany({
    where:   { userId: session.user.id },
    include: { logs: true },
    orderBy: { startedAt: "desc" },
    take:    limit,
  });

  return NextResponse.json({ sessions });
}

// POST /api/progress — log a completed workout session
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { planId, dayLabel, durationMins, notes, logs } =
      sessionSchema.parse(body);

    const workoutSession = await prisma.workoutSession.create({
      data: {
        userId:      session.user.id,
        planId,
        dayLabel,
        durationMins,
        notes,
        completedAt: new Date(),
        logs: {
          create: logs,
        },
      },
      include: { logs: true },
    });

    return NextResponse.json({ session: workoutSession }, { status: 201 });
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Progress log error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
