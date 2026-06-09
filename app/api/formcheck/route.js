import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { getPresignedUploadUrl, generateS3Key } from "@/lib/s3";
import { formCheckQueue } from "@/lib/queue";

const uploadSchema = z.object({
  exercise:    z.string(),
  filename:    z.string(),
  contentType: z.string().startsWith("video/"),
});

// POST /api/formcheck/upload — get a presigned S3 URL for direct browser upload
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { exercise, filename, contentType } = uploadSchema.parse(body);

    const s3Key = generateS3Key(session.user.id, "form-checks", filename);

    // Get presigned URL — browser uploads directly to S3
    const uploadUrl = await getPresignedUploadUrl(s3Key, contentType);

    // Create a pending FormCheck record in DB
    const formCheck = await prisma.formCheck.create({
      data: {
        userId:   session.user.id,
        exercise,
        videoUrl: s3Key,
        status:   "PENDING",
      },
    });

    // Once browser finishes uploading, it calls /api/formcheck/analyse
    return NextResponse.json({ uploadUrl, formCheckId: formCheck.id, s3Key });
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Form check upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
