type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

export function allowWithinWindow(
  key: string,
  options: { now?: number; max?: number; windowMs?: number } = {}
) {
  const now = options.now ?? Date.now();
  const max = options.max ?? 6;
  const windowMs = options.windowMs ?? 10 * 60_000;
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= max) return false;
  current.count += 1;
  buckets.set(key, current);
  return true;
}

export function clearRateLimits() {
  buckets.clear();
}
