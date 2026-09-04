import { describe, expect, it } from "vitest";
import { handleStripeWebhook } from "./stripe.webhook";

function responseMock() {
  return {
    statusCode: 200,
    status(code: number) { this.statusCode = code; return this; },
    json(payload: unknown) { return payload; },
  } as any;
}

describe("Stripe webhook", () => {
  it("returns the verification response for managed test events", async () => {
    const res = responseMock();
    const result = await handleStripeWebhook({ body: Buffer.from(JSON.stringify({ id: "evt_test_aion", type: "test" })), headers: {} } as any, res);
    expect(result).toEqual({ verified: true });
    expect(res.statusCode).toBe(200);
  });
});
