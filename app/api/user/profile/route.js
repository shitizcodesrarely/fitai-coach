import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

const updateSchema = z.object({
  name:       z.string().min(2).optional(),
  age:        z.number().min(13).max(80).optional(),
  weightKg:   z.number().min(30).max(300).optional(),
  heightCm:   z.number().min(100).max(250).optional(),
  goal:       z.enum(["BULK", "CUT", "MAINTAIN", "STRENGTH", "ENDURANCE"]).optional(),
  experience: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  daysPerWeek: z.number().min(2).max(6).optional(),
  equipment:  z.string().optional(),
}).strict();

// GET /api/user/profile
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where:  { id: session.user.id },
    select: {
      id: true, name: true, email: true, profilePic: true,
      age: true, weightKg: true, heightCm: true,
      goal: true, experience: true, daysPerWeek: true, equipment: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user });
}

// PATCH /api/user/profile
export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  try {
    const body = await request.json();
    const data = updateSchema.parse(body);

    const user = await prisma.user.update({
      where:  { id: session.user.id },
      data,
      select: {
        id: true, name: true, email: true,
        age: true, weightKg: true, heightCm: true,
        goal: true, experience: true, daysPerWeek: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
