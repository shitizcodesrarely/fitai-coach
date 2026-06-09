import Redis from "ioredis";

const globalForRedis = globalThis;

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
