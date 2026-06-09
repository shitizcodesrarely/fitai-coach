import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

const metricSchema = z.object({
  weightKg:   z.number().min(20).max(400).optional(),
  bodyFatPct: z.number().min(1).max(60).optional(),
  notes:      z.string().optional(),
});

// GET /api/progress/body — fetch body metric history
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const metrics = await prisma.bodyMetric.findMany({
    where:   { userId: session.user.id },
    orderBy: { loggedAt: "desc" },
    take:    60,
  });

  return NextResponse.json({ metrics });
}

// POST /api/progress/body — log a new body metric entry
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  try {
    const body = await request.json();
    const data = metricSchema.parse(body);

    const metric = await prisma.bodyMetric.create({
      data: { userId: session.user.id, ...data },
    });

    return NextResponse.json({ metric }, { status: 201 });
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
