import { and, asc, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { nanoid } from "nanoid";
import {
  followUpRules,
  followUpTasks,
  InsertUser,
  leads,
  messageTemplates,
  nicheTemplates,
  niches,
  notifications,
  users,
  type LeadStage,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

type DbClient = ReturnType<typeof drizzle>;

let _db: DbClient | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db
    .insert(users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result[0];
}

export async function listNiches(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(niches)
    .where(eq(niches.ownerId, ownerId))
    .orderBy(asc(niches.name));
}

export async function getNiche(ownerId: number, nicheId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(niches)
    .where(and(eq(niches.id, nicheId), eq(niches.ownerId, ownerId)))
    .limit(1);
  return result[0];
}

export async function createNiche(
  ownerId: number,
  input: { name: string; description?: string; accent?: string }
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const slug = `${input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now()}`;
  const result = await db.insert(niches).values({
    ownerId,
    name: input.name,
    slug,
    publicKey: nanoid(20),
    description: input.description,
    accent: input.accent ?? "violet",
  });
  const id = Number(result[0].insertId);
  return getNiche(ownerId, id);
}

export async function listLeads(ownerId: number, nicheId: number) {
  const db = await getDb();
  if (!db) return [];
  const owned = await getNiche(ownerId, nicheId);
  if (!owned) return [];
  return db
    .select()
    .from(leads)
    .where(eq(leads.nicheId, nicheId))
    .orderBy(desc(leads.createdAt));
}

export async function createLead(
  ownerId: number,
  input: {
    nicheId: number;
    name: string;
    email?: string;
    phone?: string;
    serviceType?: string;
    source?: string;
    notes?: string;
    consentStatus: "unknown" | "granted" | "denied";
    consentAt?: Date;
    consentSource?: string;
    isHot?: boolean;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const niche = await getNiche(ownerId, input.nicheId);
  if (!niche) throw new Error("Niche not found");
  const result = await db
    .insert(leads)
    .values({ ...input, isHot: input.isHot ?? false });
  const leadId = Number(result[0].insertId);
  if (input.isHot) {
    await db.insert(notifications).values({
      ownerId,
      nicheId: niche.id,
      leadId,
      type: "hot_lead",
      title: "Hot lead received",
      body: `${input.name} arrived from ${input.source ?? "a new source"}.`,
    });
  }
  return db
    .select()
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1)
    .then(rows => rows[0]);
}

export async function updateLead(
  ownerId: number,
  leadId: number,
  patch: {
    stage?: LeadStage;
    optOut?: boolean;
    needsHumanReview?: boolean;
    isHot?: boolean;
    consentStatus?: "unknown" | "granted" | "denied";
    firstOutreachAt?: Date | null;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const existing = await db
    .select({ lead: leads, niche: niches })
    .from(leads)
    .innerJoin(niches, eq(leads.nicheId, niches.id))
    .where(and(eq(leads.id, leadId), eq(niches.ownerId, ownerId)))
    .limit(1);
  const current = existing[0];
  if (!current) throw new Error("Lead not found");
  const nextStage = patch.stage ?? current.lead.stage;
  const nextOptOut = patch.optOut ?? current.lead.optOut;
  const nextHumanReview =
    patch.needsHumanReview ?? current.lead.needsHumanReview;
  const nextConsent = patch.consentStatus ?? current.lead.consentStatus;
  const nextFirstOutreach =
    patch.firstOutreachAt === undefined
      ? current.lead.firstOutreachAt
      : patch.firstOutreachAt;
  await db
    .update(leads)
    .set({
      ...patch,
      stage: nextStage,
      optOut: nextOptOut,
      needsHumanReview: nextHumanReview,
      firstOutreachAt: nextFirstOutreach,
      wonAt: nextStage === "Won" ? new Date() : current.lead.wonAt,
      lostAt: nextStage === "Lost" ? new Date() : current.lead.lostAt,
    })
    .where(eq(leads.id, leadId));

  if (
    nextOptOut ||
    nextHumanReview ||
    nextConsent !== "granted" ||
    nextStage === "Won" ||
    nextStage === "Lost"
  ) {
    await db
      .update(followUpTasks)
      .set({ status: "cancelled" })
      .where(
        and(
          eq(followUpTasks.leadId, leadId),
          eq(followUpTasks.status, "scheduled")
        )
      );
  }

  if (nextHumanReview && !current.lead.needsHumanReview) {
    await db.insert(notifications).values({
      ownerId,
      nicheId: current.niche.id,
      leadId,
      type: "human_review",
      title: "Lead needs human review",
      body: `${current.lead.name} was paused for manual review.`,
    });
  }

  if (
    nextStage !== current.lead.stage &&
    !nextOptOut &&
    !nextHumanReview &&
    nextConsent === "granted" &&
    nextStage !== "Won" &&
    nextStage !== "Lost"
  ) {
    const rules = await db
      .select()
      .from(followUpRules)
      .where(
        and(
          eq(followUpRules.nicheId, current.niche.id),
          eq(followUpRules.fromStage, nextStage),
          eq(followUpRules.enabled, true)
        )
      );
    for (const rule of rules) {
      await db.insert(followUpTasks).values({
        leadId,
        nicheId: current.niche.id,
        ruleId: rule.id,
        scheduledFor: new Date(Date.now() + rule.delayHours * 3600_000),
      });
    }
  }
  const updated = await db
    .select()
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1);
  return updated[0];
}

export async function getNicheMetrics(ownerId: number, nicheId: number) {
  const db = await getDb();
  if (!db)
    return {
      totalLeads: 0,
      proposalsSent: 0,
      followUpsTriggered: 0,
      won: 0,
      lost: 0,
      recovered: 0,
      averageResponseHours: 0,
    };
  const niche = await getNiche(ownerId, nicheId);
  if (!niche) throw new Error("Niche not found");
  const [leadRows, taskRows] = await Promise.all([
    db.select().from(leads).where(eq(leads.nicheId, nicheId)),
    db.select().from(followUpTasks).where(eq(followUpTasks.nicheId, nicheId)),
  ]);
  const responseHours = leadRows
    .filter(lead => lead.firstOutreachAt)
    .map(
      lead =>
        (new Date(lead.firstOutreachAt!).getTime() -
          new Date(lead.arrivedAt).getTime()) /
        3_600_000
    );
  const averageResponseHours = responseHours.length
    ? responseHours.reduce((sum, value) => sum + value, 0) /
      responseHours.length
    : 0;
  return {
    totalLeads: leadRows.length,
    proposalsSent: leadRows.filter(lead => lead.stage === "Proposal Sent")
      .length,
    followUpsTriggered: taskRows.filter(task => task.status === "sent").length,
    won: leadRows.filter(lead => lead.stage === "Won").length,
    lost: leadRows.filter(lead => lead.stage === "Lost").length,
    recovered: leadRows.filter(lead => lead.stage === "Follow-up").length,
    averageResponseHours,
  };
}

export async function listNotifications(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(notifications)
    .where(
      and(eq(notifications.ownerId, ownerId), isNull(notifications.readAt))
    )
    .orderBy(desc(notifications.createdAt))
    .limit(20);
}

export async function markNotificationRead(
  ownerId: number,
  notificationId: number
) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.ownerId, ownerId)
      )
    );
}

export async function createNicheTemplate(
  ownerId: number,
  nicheId: number,
  name: string,
  description?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const niche = await getNiche(ownerId, nicheId);
  if (!niche) throw new Error("Niche not found");
  const [templates, rules] = await Promise.all([
    db
      .select()
      .from(messageTemplates)
      .where(eq(messageTemplates.nicheId, nicheId)),
    db.select().from(followUpRules).where(eq(followUpRules.nicheId, nicheId)),
  ]);
  const result = await db.insert(nicheTemplates).values({
    ownerId,
    name,
    description,
    configJson: JSON.stringify({
      niche: {
        name: niche.name,
        description: niche.description,
        accent: niche.accent,
      },
      messageTemplates: templates,
      followUpRules: rules,
    }),
  });
  return Number(result[0].insertId);
}

export async function listTemplates(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(nicheTemplates)
    .where(eq(nicheTemplates.ownerId, ownerId))
    .orderBy(desc(nicheTemplates.createdAt));
}

export async function getDueFollowUps(nicheIds?: number[]) {
  const db = await getDb();
  if (!db) return [];
  if (nicheIds && nicheIds.length === 0) return [];
  return db
    .select({ task: followUpTasks, lead: leads })
    .from(followUpTasks)
    .innerJoin(leads, eq(followUpTasks.leadId, leads.id))
    .where(
      and(
        eq(followUpTasks.status, "scheduled"),
        sql`${followUpTasks.scheduledFor} <= NOW()`,
        eq(leads.optOut, false),
        eq(leads.needsHumanReview, false),
        eq(leads.consentStatus, "granted"),
        sql`${leads.stage} NOT IN ('Won', 'Lost')`,
        nicheIds ? inArray(followUpTasks.nicheId, nicheIds) : undefined
      )
    )
    .orderBy(asc(followUpTasks.scheduledFor));
}

export async function getNicheByPublicKey(publicKey: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select({
      id: niches.id,
      name: niches.name,
      description: niches.description,
      publicKey: niches.publicKey,
    })
    .from(niches)
    .where(and(eq(niches.publicKey, publicKey), eq(niches.isActive, true)))
    .limit(1);
  return result[0];
}

export async function createPublicLead(input: {
  publicKey: string;
  name: string;
  email?: string;
  phone?: string;
  serviceType?: string;
  notes?: string;
}) {
  const niche = await getNicheByPublicKey(input.publicKey);
  if (!niche) throw new Error("Niche not found");
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const owner = (
    await db
      .select({ ownerId: niches.ownerId })
      .from(niches)
      .where(eq(niches.id, niche.id))
      .limit(1)
  )[0];
  if (!owner) throw new Error("Niche not found");
  return createLead(owner.ownerId, {
    nicheId: niche.id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    serviceType: input.serviceType,
    notes: input.notes,
    source: "public intake",
    consentStatus: "granted",
    consentAt: new Date(),
    consentSource: "public intake form",
    isHot: false,
  });
}

export async function claimEligibleFollowUpTask(db: DbClient, taskId: number) {
  const claimed = await db
    .update(followUpTasks)
    .set({ status: "sent", executedAt: new Date() })
    .where(
      and(
        eq(followUpTasks.id, taskId),
        eq(followUpTasks.status, "scheduled"),
        sql`EXISTS (
          SELECT 1 FROM \`leads\`
          WHERE \`leads\`.\`id\` = \`followUpTasks\`.\`leadId\`
            AND \`leads\`.\`consentStatus\` = 'granted'
            AND \`leads\`.\`optOut\` = false
            AND \`leads\`.\`needsHumanReview\` = false
            AND \`leads\`.\`stage\` NOT IN ('Won', 'Lost')
        )`
      )
    );
  return Number((claimed as { affectedRows?: number }).affectedRows ?? 0) === 1;
}

export async function processDueFollowUps(nicheIds?: number[]) {
  const db = await getDb();
  if (!db) return { processed: 0, cancelled: 0 };
  const due = await getDueFollowUps(nicheIds);
  let processed = 0;
  let cancelled = 0;
  for (const item of due) {
    const lead = item.lead;
    if (
      lead.optOut ||
      lead.needsHumanReview ||
      lead.consentStatus !== "granted" ||
      lead.stage === "Won" ||
      lead.stage === "Lost"
    ) {
      await db
        .update(followUpTasks)
        .set({ status: "cancelled", executedAt: new Date() })
        .where(
          and(
            eq(followUpTasks.id, item.task.id),
            eq(followUpTasks.status, "scheduled")
          )
        );
      cancelled += 1;
      continue;
    }
    if (await claimEligibleFollowUpTask(db, item.task.id)) {
      if (!lead.firstOutreachAt)
        await db
          .update(leads)
          .set({ firstOutreachAt: new Date() })
          .where(eq(leads.id, lead.id));
      await db.insert(notifications).values({
        ownerId:
          (
            await db
              .select({ ownerId: niches.ownerId })
              .from(niches)
              .where(eq(niches.id, item.task.nicheId))
              .limit(1)
          )[0]?.ownerId ?? 0,
        nicheId: item.task.nicheId,
        leadId: lead.id,
        type: "follow_up_due",
        title: "Follow-up is due",
        body: `${lead.name} is ready for the next approved follow-up.`,
      });
      processed += 1;
    }
  }
  return { processed, cancelled };
}

export async function listAutomationConfig(ownerId: number, nicheId: number) {
  const db = await getDb();
  if (!db) return { messageTemplates: [], followUpRules: [] };
  const niche = await getNiche(ownerId, nicheId);
  if (!niche) throw new Error("Niche not found");
  const [templates, rules] = await Promise.all([
    db
      .select()
      .from(messageTemplates)
      .where(eq(messageTemplates.nicheId, nicheId))
      .orderBy(asc(messageTemplates.createdAt)),
    db
      .select()
      .from(followUpRules)
      .where(eq(followUpRules.nicheId, nicheId))
      .orderBy(asc(followUpRules.delayHours)),
  ]);
  return { messageTemplates: templates, followUpRules: rules };
}

export async function createMessageTemplate(
  ownerId: number,
  input: {
    nicheId: number;
    name: string;
    stage: LeadStage;
    channel: "email" | "sms" | "whatsapp";
    subject?: string;
    body: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  if (!(await getNiche(ownerId, input.nicheId)))
    throw new Error("Niche not found");
  const result = await db.insert(messageTemplates).values(input);
  return Number(result[0].insertId);
}

export async function createFollowUpRule(
  ownerId: number,
  input: {
    nicheId: number;
    fromStage: LeadStage;
    delayHours: number;
    templateId?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  if (!(await getNiche(ownerId, input.nicheId)))
    throw new Error("Niche not found");
  const result = await db.insert(followUpRules).values(input);
  return Number(result[0].insertId);
}

export async function updateNiche(
  ownerId: number,
  nicheId: number,
  patch: {
    name?: string;
    description?: string;
    accent?: string;
    isActive?: boolean;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  if (!(await getNiche(ownerId, nicheId))) throw new Error("Niche not found");
  await db
    .update(niches)
    .set(patch)
    .where(and(eq(niches.id, nicheId), eq(niches.ownerId, ownerId)));
  return getNiche(ownerId, nicheId);
}

export async function cloneNicheTemplate(
  ownerId: number,
  templateId: number,
  name: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const template = (
    await db
      .select()
      .from(nicheTemplates)
      .where(
        and(
          eq(nicheTemplates.id, templateId),
          eq(nicheTemplates.ownerId, ownerId)
        )
      )
      .limit(1)
  )[0];
  if (!template) throw new Error("Template not found");
  const parsed = JSON.parse(template.configJson) as {
    niche?: { description?: string; accent?: string };
    messageTemplates?: Array<{
      id?: number;
      name: string;
      stage: LeadStage;
      channel: "email" | "sms" | "whatsapp";
      subject?: string;
      body: string;
    }>;
    followUpRules?: Array<{
      fromStage: LeadStage;
      delayHours: number;
      templateId?: number;
    }>;
  };
  const niche = await createNiche(ownerId, {
    name,
    description: parsed.niche?.description,
    accent: parsed.niche?.accent,
  });
  if (!niche) throw new Error("Could not create niche");
  const templateIdMap = new Map<number, number>();
  for (const templateItem of parsed.messageTemplates ?? []) {
    const { id: sourceTemplateId, ...templateValues } = templateItem;
    const result = await db
      .insert(messageTemplates)
      .values({ nicheId: niche.id, ...templateValues });
    if (sourceTemplateId)
      templateIdMap.set(sourceTemplateId, Number(result[0].insertId));
  }
  for (const rule of parsed.followUpRules ?? []) {
    await db.insert(followUpRules).values({
      nicheId: niche.id,
      fromStage: rule.fromStage,
      delayHours: rule.delayHours,
      templateId: rule.templateId
        ? templateIdMap.get(rule.templateId)
        : undefined,
    });
  }
  return niche;
}
