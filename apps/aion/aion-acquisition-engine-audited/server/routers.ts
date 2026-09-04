import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { LEAD_STAGES } from "../drizzle/schema";
import {
  createLead,
  createNiche,
  createNicheTemplate,
  createPublicLead,
  createMessageTemplate,
  createFollowUpRule,
  updateNiche,
  cloneNicheTemplate,
  getNicheMetrics,
  getNiche,
  listAutomationConfig,
  getNicheByPublicKey,
  listLeads,
  listNiches,
  listNotifications,
  listTemplates,
  markNotificationRead,
  processDueFollowUps,
  updateLead,
} from "./db";
import { allowWithinWindow } from "./rateLimit";

const stageSchema = z.enum(LEAD_STAGES);
const consentSchema = z.enum(["unknown", "granted", "denied"]);

const leadInput = z.object({
  nicheId: z.number().int().positive(),
  name: z.string().min(2).max(160),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional(),
  serviceType: z.string().max(160).optional(),
  source: z.string().max(120).optional(),
  notes: z.string().max(5000).optional(),
  consentStatus: consentSchema,
  isHot: z.boolean().optional(),
});

const publicLeadInput = z.object({
  publicKey: z.string().min(16).max(32),
  name: z.string().min(2).max(160),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional(),
  serviceType: z.string().max(160).optional(),
  notes: z.string().max(5000).optional(),
  website: z.string().max(0).optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  niches: router({
    list: protectedProcedure.query(({ ctx }) => listNiches(ctx.user.id)),
    get: protectedProcedure
      .input(z.object({ nicheId: z.number().int().positive() }))
      .query(
        async ({ ctx, input }) =>
          (await getNiche(ctx.user.id, input.nicheId)) ?? null
      ),
    getPublic: publicProcedure
      .input(z.object({ publicKey: z.string().min(16).max(32) }))
      .query(
        async ({ input }) =>
          (await getNicheByPublicKey(input.publicKey)) ?? null
      ),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(2).max(120),
          description: z.string().max(500).optional(),
          accent: z.string().max(32).optional(),
        })
      )
      .mutation(({ ctx, input }) => createNiche(ctx.user.id, input)),
    update: protectedProcedure
      .input(
        z.object({
          nicheId: z.number().int().positive(),
          name: z.string().min(2).max(120).optional(),
          description: z.string().max(500).optional(),
          accent: z.string().max(32).optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        const { nicheId, ...patch } = input;
        return updateNiche(ctx.user.id, nicheId, patch);
      }),
  }),
  leads: router({
    list: protectedProcedure
      .input(z.object({ nicheId: z.number().int().positive() }))
      .query(({ ctx, input }) => listLeads(ctx.user.id, input.nicheId)),
    create: protectedProcedure
      .input(leadInput)
      .mutation(({ ctx, input }) => createLead(ctx.user.id, input)),
    intake: publicProcedure
      .input(publicLeadInput)
      .mutation(({ ctx, input }) => {
        if (input.website) throw new Error("Invalid form submission");
        const clientIp =
          ctx.req.ip || ctx.req.socket.remoteAddress || "unknown";
        if (!allowWithinWindow(`${clientIp}:${input.publicKey}`)) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Too many requests. Please try again later.",
          });
        }
        const { website: _website, ...lead } = input;
        return createPublicLead(lead);
      }),
    update: protectedProcedure
      .input(
        z.object({
          leadId: z.number().int().positive(),
          stage: stageSchema.optional(),
          optOut: z.boolean().optional(),
          needsHumanReview: z.boolean().optional(),
          isHot: z.boolean().optional(),
          consentStatus: consentSchema.optional(),
          firstOutreachAt: z.coerce.date().nullable().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        const { leadId, ...patch } = input;
        return updateLead(ctx.user.id, leadId, patch);
      }),
  }),
  metrics: router({
    byNiche: protectedProcedure
      .input(z.object({ nicheId: z.number().int().positive() }))
      .query(({ ctx, input }) => getNicheMetrics(ctx.user.id, input.nicheId)),
  }),
  notifications: router({
    list: protectedProcedure.query(({ ctx }) => listNotifications(ctx.user.id)),
    markRead: protectedProcedure
      .input(z.object({ notificationId: z.number().int().positive() }))
      .mutation(({ ctx, input }) =>
        markNotificationRead(ctx.user.id, input.notificationId)
      ),
  }),
  automation: router({
    processDue: protectedProcedure.mutation(async ({ ctx }) => {
      const ownedNiches = await listNiches(ctx.user.id);
      return processDueFollowUps(ownedNiches.map(niche => niche.id));
    }),
  }),
  automationConfig: router({
    get: protectedProcedure
      .input(z.object({ nicheId: z.number().int().positive() }))
      .query(({ ctx, input }) =>
        listAutomationConfig(ctx.user.id, input.nicheId)
      ),
    createMessage: protectedProcedure
      .input(
        z.object({
          nicheId: z.number().int().positive(),
          name: z.string().min(2).max(120),
          stage: stageSchema,
          channel: z.enum(["email", "sms", "whatsapp"]),
          subject: z.string().max(220).optional(),
          body: z.string().min(1).max(10000),
        })
      )
      .mutation(({ ctx, input }) => createMessageTemplate(ctx.user.id, input)),
    createRule: protectedProcedure
      .input(
        z.object({
          nicheId: z.number().int().positive(),
          fromStage: stageSchema,
          delayHours: z.number().int().positive().max(8760),
          templateId: z.number().int().positive().optional(),
        })
      )
      .mutation(({ ctx, input }) => createFollowUpRule(ctx.user.id, input)),
  }),
  templates: router({
    list: protectedProcedure.query(({ ctx }) => listTemplates(ctx.user.id)),
    save: protectedProcedure
      .input(
        z.object({
          nicheId: z.number().int().positive(),
          name: z.string().min(2).max(120),
          description: z.string().max(500).optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        createNicheTemplate(
          ctx.user.id,
          input.nicheId,
          input.name,
          input.description
        )
      ),
    clone: protectedProcedure
      .input(
        z.object({
          templateId: z.number().int().positive(),
          name: z.string().min(2).max(120),
        })
      )
      .mutation(({ ctx, input }) =>
        cloneNicheTemplate(ctx.user.id, input.templateId, input.name)
      ),
  }),
});

export type AppRouter = typeof appRouter;
