import { Queue } from "bullmq";
import { redis } from "./redis.js";

// Each queue handles a different type of background job
export const workoutPlanQueue  = new Queue("workout-plan",   { connection: redis });
export const formCheckQueue    = new Queue("form-check",     { connection: redis });
export const weeklyReportQueue = new Queue("weekly-report",  { connection: redis });
export const emailQueue        = new Queue("email",          { connection: redis });
