import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { getDb, processDueFollowUps } from "../db";
import { niches } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { sdk } from "./sdk";
import { scopeNicheIdsForTask } from "../scheduling";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // AION intake does not accept file uploads; conservative limits reduce abuse risk.
  app.use(express.json({ limit: "256kb" }));
  app.use(express.urlencoded({ limit: "256kb", extended: false }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.post("/api/scheduled/process-followups", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      if (!user.isCron || !user.taskUid)
        return res.status(403).json({ error: "cron-only" });
      const db = await getDb();
      if (!db) return res.status(503).json({ error: "database-unavailable" });
      const scheduledNiches = await db
        .select({
          id: niches.id,
          scheduleCronTaskUid: niches.scheduleCronTaskUid,
        })
        .from(niches)
        .where(eq(niches.scheduleCronTaskUid, user.taskUid));
      const scopedNicheIds = scopeNicheIdsForTask(
        scheduledNiches,
        user.taskUid
      );
      if (scopedNicheIds.length === 0)
        return res.json({ ok: true, skipped: "orphan-or-unscoped-cron" });
      const result = await processDueFollowUps(scopedNicheIds);
      return res.json({ ok: true, ...result });
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
