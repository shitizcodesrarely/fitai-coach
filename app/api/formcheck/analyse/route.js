import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { formCheckQueue } from "@/lib/queue";

const schema = z.object({
  formCheckId: z.string(),
});

// POST /api/formcheck/analyse
// Called by the browser AFTER it finishes uploading the video directly to S3.
// This queues the background job that downloads from S3, extracts a frame, and calls Claude Vision.
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { formCheckId } = schema.parse(body);

    // Verify this formCheck belongs to the current user
    const formCheck = await prisma.formCheck.findUnique({
      where: { id: formCheckId },
    });

    if (!formCheck || formCheck.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Queue the analysis job — worker picks this up and calls Claude Vision
    await formCheckQueue.add("analyse", {
      formCheckId: formCheck.id,
      s3Key:       formCheck.videoUrl,
      exercise:    formCheck.exercise,
    });

    return NextResponse.json({ queued: true });
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Form check analyse error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
