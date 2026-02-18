type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
  limit: number;
};

declare global {
  var __hcRateLimitStore: Map<string, RateLimitBucket> | undefined;
}

function getStore() {
  if (!globalThis.__hcRateLimitStore) {
    globalThis.__hcRateLimitStore = new Map<string, RateLimitBucket>();
  }
  return globalThis.__hcRateLimitStore;
}

export function applyRateLimit(input: {
  key: string;
  windowMs: number;
  limit: number;
  now?: number;
}): RateLimitResult {
  const { key, windowMs, limit } = input;
  const now = input.now ?? Date.now();
  const store = getStore();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      retryAfter: Math.ceil(windowMs / 1000),
      limit,
    };
  }

  bucket.count += 1;
  store.set(key, bucket);

  const remaining = Math.max(0, limit - bucket.count);
  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  const allowed = bucket.count <= limit;

  return { allowed, remaining, retryAfter, limit };
}
