import { describe, expect, it } from "vitest";
import {
  canClaimFollowUp,
  canScheduleFollowUp,
  responseTimeHours,
  shouldHaltAutomation,
} from "./automation";

describe("AION automation guardrails", () => {
  const grantedLead = {
    optOut: false,
    needsHumanReview: false,
    consentStatus: "granted" as const,
    stage: "Contacted" as const,
  };

  it("allows a consented lead in an active stage", () => {
    expect(shouldHaltAutomation(grantedLead)).toBe(false);
    expect(canScheduleFollowUp(grantedLead)).toBe(true);
  });

  it.each([
    ["opted out", { ...grantedLead, optOut: true }],
    ["needs human review", { ...grantedLead, needsHumanReview: true }],
    ["without consent", { ...grantedLead, consentStatus: "unknown" as const }],
    ["won", { ...grantedLead, stage: "Won" as const }],
    ["lost", { ...grantedLead, stage: "Lost" as const }],
  ])("halts automation when a lead is %s", (_, lead) => {
    expect(shouldHaltAutomation(lead)).toBe(true);
    expect(canScheduleFollowUp(lead)).toBe(false);
  });

  it("calculates first response time in hours", () => {
    const arrived = new Date("2026-08-20T08:00:00Z");
    const outreach = new Date("2026-08-20T10:30:00Z");
    expect(responseTimeHours(arrived, outreach)).toBe(2.5);
    expect(responseTimeHours(arrived, null)).toBeNull();
  });

  it("claims a due task only once and only for an eligible lead", () => {
    expect(canClaimFollowUp("scheduled", grantedLead)).toBe(true);
    expect(canClaimFollowUp("sent", grantedLead)).toBe(false);
    expect(canClaimFollowUp("cancelled", grantedLead)).toBe(false);
    expect(
      canClaimFollowUp("scheduled", { ...grantedLead, optOut: true })
    ).toBe(false);
    expect(
      canClaimFollowUp("scheduled", { ...grantedLead, consentStatus: "denied" })
    ).toBe(false);
  });
});
