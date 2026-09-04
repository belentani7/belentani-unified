import { afterEach, describe, expect, it } from "vitest";
import { allowWithinWindow, clearRateLimits } from "./rateLimit";

describe("public intake rate limit", () => {
  afterEach(clearRateLimits);

  it("allows a bounded number of requests in one window", () => {
    expect(
      allowWithinWindow("ip:niche", { now: 1, max: 2, windowMs: 1000 })
    ).toBe(true);
    expect(
      allowWithinWindow("ip:niche", { now: 2, max: 2, windowMs: 1000 })
    ).toBe(true);
    expect(
      allowWithinWindow("ip:niche", { now: 3, max: 2, windowMs: 1000 })
    ).toBe(false);
  });

  it("resets a bucket after its configured window", () => {
    expect(
      allowWithinWindow("ip:niche", { now: 1, max: 1, windowMs: 1000 })
    ).toBe(true);
    expect(
      allowWithinWindow("ip:niche", { now: 1001, max: 1, windowMs: 1000 })
    ).toBe(true);
  });
});
