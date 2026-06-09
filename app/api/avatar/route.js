import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

// POST /api/avatar - save avatar data
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await request.json();
  const { avatarData } = body;

  if (!avatarData) {
    return NextResponse.json({ error: "avatarData required" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data:  { avatarData: JSON.stringify(avatarData) },
  });

  return NextResponse.json({ success: true });
}

// GET /api/avatar - get current avatar
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where:  { id: session.user.id },
    select: { avatarData: true },
  });

  const avatarData = user?.avatarData ? JSON.parse(user.avatarData) : null;
  return NextResponse.json({ avatarData });
}
