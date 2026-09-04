import { describe, expect, it } from "vitest";
import { isTaskAuthorizedForNiche, scopeNicheIdsForTask } from "./scheduling";

describe("scheduled follow-up scope", () => {
  it("allows only the Heartbeat task assigned to the niche", () => {
    expect(isTaskAuthorizedForNiche("task-a", "task-a")).toBe(true);
    expect(isTaskAuthorizedForNiche("task-a", "task-b")).toBe(false);
    expect(isTaskAuthorizedForNiche(null, "task-a")).toBe(false);
    expect(isTaskAuthorizedForNiche("task-a", null)).toBe(false);
  });

  it("returns only the niche IDs assigned to the authenticated task", () => {
    expect(
      scopeNicheIdsForTask(
        [
          { id: 1, scheduleCronTaskUid: "task-a" },
          { id: 2, scheduleCronTaskUid: "task-b" },
          { id: 3, scheduleCronTaskUid: null },
        ],
        "task-a"
      )
    ).toEqual([1]);
  });
});
