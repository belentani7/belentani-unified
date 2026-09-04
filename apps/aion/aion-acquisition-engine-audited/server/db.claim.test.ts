import { describe, expect, it } from "vitest";
import { claimEligibleFollowUpTask } from "./db";

function fakeDb(affectedRows: number) {
  return {
    update: () => ({
      set: () => ({
        where: async () => ({ affectedRows }),
      }),
    }),
  };
}

describe("atomic follow-up task claim", () => {
  it("treats a single affected database row as the only successful claim", async () => {
    const db = fakeDb(1) as unknown as Parameters<
      typeof claimEligibleFollowUpTask
    >[0];
    await expect(claimEligibleFollowUpTask(db, 42)).resolves.toBe(true);
  });

  it("does not claim the task a second time when the database reports no matching row", async () => {
    const db = fakeDb(0) as unknown as Parameters<
      typeof claimEligibleFollowUpTask
    >[0];
    await expect(claimEligibleFollowUpTask(db, 42)).resolves.toBe(false);
  });
});
