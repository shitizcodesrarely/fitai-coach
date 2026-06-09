import { Worker } from "bullmq";
import { redis } from "../lib/redis.js";
import { prisma } from "../lib/db.js";
import { generateWorkoutPlan, analyseFormCheck, generateWeeklyCoaching } from "../lib/ai.js";
import { sendWeeklyDigest } from "../lib/ses.js";
import { s3, getCdnUrl } from "../lib/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

console.log("Workers starting...");

// ─── Worker 1: Generate AI workout plan ──────────────────────────────────────
const workoutPlanWorker = new Worker(
  "workout-plan",
  async (job) => {
    const { userId, profile } = job.data;
    console.log(`Generating workout plan for user ${userId}`);

    // Call Claude API — this takes 3-5 seconds
    const planData = await generateWorkoutPlan(profile);

    // Save plan to database
    await prisma.workoutPlan.create({
      data: {
        userId,
        title:    planData.title,
        planData: planData,
        isActive: true,
      },
    });

    console.log(`Workout plan created for user ${userId}`);
    return { success: true };
  },
  { connection: redis, concurrency: 3 }
);

// ─── Worker 2: Analyse form check video ──────────────────────────────────────
const formCheckWorker = new Worker(
  "form-check",
  async (job) => {
    const { formCheckId, s3Key, exercise } = job.data;
    console.log(`Analysing form check ${formCheckId}`);

    // Mark as processing
    await prisma.formCheck.update({
      where: { id: formCheckId },
      data:  { status: "PROCESSING" },
    });

    // Download video from S3
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    });
    const s3Response = await s3.send(getCommand);
    const videoBuffer = Buffer.from(await s3Response.Body.transformToByteArray());

    // Convert first frame to base64 for Claude Vision
    // In production: use FFmpeg to extract the clearest frame
    const base64Frame = videoBuffer.toString("base64").slice(0, 100000);

    const feedback = await analyseFormCheck(base64Frame, exercise);

    // Save feedback and mark as done
    await prisma.formCheck.update({
      where: { id: formCheckId },
      data: {
        status:     "DONE",
        aiFeedback: feedback,
      },
    });

    console.log(`Form check ${formCheckId} analysed`);
    return { success: true, feedback };
  },
  { connection: redis, concurrency: 2 }
);

// ─── Worker 3: Weekly coaching report (triggered by cron job) ─────────────────
const weeklyReportWorker = new Worker(
  "weekly-report",
  async (job) => {
    const { userId } = job.data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    // Get last 7 days of sessions
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const sessions = await prisma.workoutSession.findMany({
      where:   { userId, startedAt: { gte: sevenDaysAgo } },
      include: { logs: true },
    });

    const summary = {
      sessionsCompleted: sessions.length,
      totalVolume: sessions.reduce((total, s) =>
        total + s.logs.reduce((t, l) => t + l.reps * l.weightKg, 0), 0
      ),
    };

    const coachingMessage = await generateWeeklyCoaching(user, summary);
    await sendWeeklyDigest(user, coachingMessage, summary);

    console.log(`Weekly report sent to ${user.email}`);
  },
  { connection: redis, concurrency: 5 }
);

// ─── Error handling ───────────────────────────────────────────────────────────
[workoutPlanWorker, formCheckWorker, weeklyReportWorker].forEach((worker) => {
  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} in ${worker.name} failed:`, err.message);
  });
  worker.on("completed", (job) => {
    console.log(`Job ${job.id} in ${worker.name} completed`);
  });
});

console.log("All workers running and listening for jobs...");
