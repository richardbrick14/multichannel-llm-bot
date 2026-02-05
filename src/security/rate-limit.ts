/**
 * Per-user rate limiting (in-memory)
 */
import type { SecurityConfig } from '../types.js';

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const entries = new Map<string, RateLimitEntry>();

export function createRateLimiter(config: SecurityConfig) {
  const { rateLimitPerUser, rateLimitWindowMs } = config;

  return {
    check(userId: string): { allowed: boolean; reason?: string } {
      const key = userId;
      const now = Date.now();
      const entry = entries.get(key);

      if (!entry) {
        entries.set(key, { count: 1, windowStart: now });
        return { allowed: true };
      }

      const elapsed = now - entry.windowStart;
      if (elapsed >= rateLimitWindowMs) {
        entries.set(key, { count: 1, windowStart: now });
        return { allowed: true };
      }

      if (entry.count >= rateLimitPerUser) {
        return {
          allowed: false,
          reason: `Rate limit exceeded. Try again in ${Math.ceil((rateLimitWindowMs - elapsed) / 1000)} seconds.`,
        };
      }

      entry.count += 1;
      return { allowed: true };
    },
  };
}
