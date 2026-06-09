import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { processWorkoutCompletion } from "@/lib/gamification";

const schema = z.object({
  sessionId:      z.string(),
  totalVolumeKg:  z.number(),
  hitAllSets:     z.boolean(),
  personalBests:  z.number().default(0),
  startedAt:      z.string(),
});

// POST /api/gamification
// Called right after a workout session is saved.
// Returns XP earned, level up info, new badges, streak, rank title.
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const result = await processWorkoutCompletion(session.user.id, {
      ...data,
      userId: session.user.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Gamification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/gamification - fetch user's current stats
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { prisma } = await import("@/lib/db");

  const stats = await prisma.userStats.findUnique({
    where: { userId: session.user.id },
  });

  const badges = await prisma.userBadge.findMany({
    where:   { userId: session.user.id },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
  });

  return NextResponse.json({ stats, badges });
}
