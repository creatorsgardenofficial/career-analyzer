type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

export type RateLimitConfig = {
  key: string;
  limit: number;
  windowMs: number;
};

export function checkRateLimit(config: RateLimitConfig): {
  allowed: boolean;
  retryAfterMs: number;
} {
  const now = Date.now();
  const existing = store.get(config.key);

  if (!existing || existing.resetAt <= now) {
    store.set(config.key, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (existing.count >= config.limit) {
    return {
      allowed: false,
      retryAfterMs: existing.resetAt - now,
    };
  }

  existing.count += 1;
  store.set(config.key, existing);
  return { allowed: true, retryAfterMs: 0 };
}

export function rateLimitMessage(retryAfterMs: number): string {
  const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return `操作が多すぎます。${seconds}秒後にもう一度お試しください。`;
}
