import type { Lead } from "../drizzle/schema";

export function shouldHaltAutomation(
  lead: Pick<Lead, "optOut" | "needsHumanReview" | "consentStatus" | "stage">
) {
  return (
    lead.optOut ||
    lead.needsHumanReview ||
    lead.consentStatus !== "granted" ||
    lead.stage === "Won" ||
    lead.stage === "Lost"
  );
}

export function canScheduleFollowUp(
  lead: Pick<Lead, "optOut" | "needsHumanReview" | "consentStatus" | "stage">
) {
  return !shouldHaltAutomation(lead);
}

export function canClaimFollowUp(
  taskStatus: "scheduled" | "sent" | "cancelled" | "failed",
  lead: Pick<Lead, "optOut" | "needsHumanReview" | "consentStatus" | "stage">
) {
  return taskStatus === "scheduled" && canScheduleFollowUp(lead);
}

export function responseTimeHours(
  arrivedAt: Date,
  firstOutreachAt: Date | null | undefined
) {
  if (!firstOutreachAt) return null;
  return Math.max(
    0,
    (firstOutreachAt.getTime() - arrivedAt.getTime()) / 3_600_000
  );
}
