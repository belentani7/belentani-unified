import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const niches = mysqlTable("niches", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 140 }).notNull(),
  publicKey: varchar("publicKey", { length: 32 }).notNull().unique(),
  description: text("description"),
  accent: varchar("accent", { length: 32 }).default("violet").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ ownerIdx: index("niches_owner_idx").on(table.ownerId) }));

export const nicheTemplates = mysqlTable("nicheTemplates", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  configJson: text("configJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ ownerIdx: index("niche_templates_owner_idx").on(table.ownerId) }));

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  nicheId: int("nicheId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 40 }),
  serviceType: varchar("serviceType", { length: 160 }),
  source: varchar("source", { length: 120 }),
  notes: text("notes"),
  stage: mysqlEnum("stage", ["New", "Contacted", "Qualified", "Proposal Sent", "Follow-up", "Won", "Lost"]).default("New").notNull(),
  consentStatus: mysqlEnum("consentStatus", ["unknown", "granted", "denied"]).default("unknown").notNull(),
  consentAt: timestamp("consentAt"),
  consentSource: varchar("consentSource", { length: 120 }),
  optOut: boolean("optOut").default(false).notNull(),
  needsHumanReview: boolean("needsHumanReview").default(false).notNull(),
  isHot: boolean("isHot").default(false).notNull(),
  arrivedAt: timestamp("arrivedAt").defaultNow().notNull(),
  firstOutreachAt: timestamp("firstOutreachAt"),
  wonAt: timestamp("wonAt"),
  lostAt: timestamp("lostAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ nicheStageIdx: index("leads_niche_stage_idx").on(table.nicheId, table.stage), nicheCreatedIdx: index("leads_niche_created_idx").on(table.nicheId, table.createdAt) }));

export const messageTemplates = mysqlTable("messageTemplates", {
  id: int("id").autoincrement().primaryKey(),
  nicheId: int("nicheId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  stage: mysqlEnum("stage", ["New", "Contacted", "Qualified", "Proposal Sent", "Follow-up", "Won", "Lost"]).notNull(),
  channel: mysqlEnum("channel", ["email", "sms", "whatsapp"]).default("email").notNull(),
  subject: varchar("subject", { length: 220 }),
  body: text("body").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ nicheIdx: index("message_templates_niche_idx").on(table.nicheId) }));

export const followUpRules = mysqlTable("followUpRules", {
  id: int("id").autoincrement().primaryKey(),
  nicheId: int("nicheId").notNull(),
  fromStage: mysqlEnum("fromStage", ["New", "Contacted", "Qualified", "Proposal Sent", "Follow-up", "Won", "Lost"]).notNull(),
  delayHours: int("delayHours").notNull(),
  templateId: int("templateId"),
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ nicheIdx: index("follow_up_rules_niche_idx").on(table.nicheId) }));

export const followUpTasks = mysqlTable("followUpTasks", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  nicheId: int("nicheId").notNull(),
  ruleId: int("ruleId"),
  scheduledFor: timestamp("scheduledFor").notNull(),
  executedAt: timestamp("executedAt"),
  status: mysqlEnum("status", ["scheduled", "sent", "cancelled", "failed"]).default("scheduled").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ dueIdx: index("follow_up_tasks_due_idx").on(table.status, table.scheduledFor), leadIdx: index("follow_up_tasks_lead_idx").on(table.leadId) }));

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  nicheId: int("nicheId"),
  leadId: int("leadId"),
  type: mysqlEnum("type", ["hot_lead", "follow_up_due", "human_review"]).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  body: text("body").notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ ownerIdx: index("notifications_owner_idx").on(table.ownerId, table.readAt) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Niche = typeof niches.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type MessageTemplate = typeof messageTemplates.$inferSelect;
export type FollowUpRule = typeof followUpRules.$inferSelect;
export type FollowUpTask = typeof followUpTasks.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export const LEAD_STAGES = ["New", "Contacted", "Qualified", "Proposal Sent", "Follow-up", "Won", "Lost"] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];
