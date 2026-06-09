import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

// GET /api/leaderboard?type=weekly|alltime|levels
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "weekly";

  // Get friend IDs
  const friends = await prisma.friend.findMany({
    where:  { userId: session.user.id },
    select: { friendId: true },
  });
  const friendIds = friends.map((f) => f.friendId);

  // Include self in leaderboard
  const userIds = [session.user.id, ...friendIds];

  // Fetch stats for all users
  const stats = await prisma.userStats.findMany({
    where: { userId: { in: userIds } },
    include: {
      user: {
        select: { id: true, name: true, avatarData: true },
      },
    },
  });

  // Sort based on type
  let sorted;
  if (type === "weekly") {
    sorted = stats.sort((a, b) => b.weeklyVolume - a.weeklyVolume);
  } else if (type === "alltime") {
    sorted = stats.sort((a, b) => b.totalVolumeKg - a.totalVolumeKg);
  } else {
    sorted = stats.sort((a, b) => b.xp - a.xp);
  }

  const leaderboard = sorted.map((s, i) => ({
    rank:          i + 1,
    userId:        s.userId,
    name:          s.user.name,
    avatarData:    s.user.avatarData,
    xp:            s.xp,
    level:         s.level,
    weeklyVolume:  s.weeklyVolume,
    totalVolume:   s.totalVolumeKg,
    streak:        s.currentStreak,
    isYou:         s.userId === session.user.id,
  }));

  return NextResponse.json({ leaderboard, type });
}

// POST /api/leaderboard/add-friend
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { friendEmail } = await request.json();

  const friend = await prisma.user.findUnique({ where: { email: friendEmail } });
  if (!friend) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (friend.id === session.user.id) {
    return NextResponse.json({ error: "Cannot add yourself" }, { status: 400 });
  }

  await prisma.friend.upsert({
    where: {
      userId_friendId: { userId: session.user.id, friendId: friend.id },
    },
    create: { userId: session.user.id, friendId: friend.id },
    update: {},
  });

  return NextResponse.json({ success: true, friend: { name: friend.name } });
}
