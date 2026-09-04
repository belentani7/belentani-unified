export function isTaskAuthorizedForNiche(
  nicheTaskUid: string | null | undefined,
  runnerTaskUid: string | null | undefined
) {
  return Boolean(
    nicheTaskUid && runnerTaskUid && nicheTaskUid === runnerTaskUid
  );
}

export function scopeNicheIdsForTask(
  niches: Array<{ id: number; scheduleCronTaskUid: string | null }>,
  runnerTaskUid: string | null | undefined
) {
  return niches
    .filter(niche =>
      isTaskAuthorizedForNiche(niche.scheduleCronTaskUid, runnerTaskUid)
    )
    .map(niche => niche.id);
}
