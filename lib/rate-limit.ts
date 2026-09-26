import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Guards the public registration / contact / partnership-enquiry forms
 * against spam and scripted abuse. Falls back to "always allow" if Upstash
 * env vars aren't set (e.g. local dev) — set UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN in production (see .env.example).
 */
const hasRedisConfig = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

const ratelimit = hasRedisConfig
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 submissions / 10 min / key
      analytics: true,
    })
  : null;

export async function checkRateLimit(key: string) {
  if (!ratelimit) {
    if (process.env.VERCEL_ENV === "production") {
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL / TOKEN are unset. Public forms are not throttled."
      );
    }
    return { success: true };
  }
  return ratelimit.limit(key);
}
