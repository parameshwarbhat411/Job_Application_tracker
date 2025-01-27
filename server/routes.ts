import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { jobs } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Jobs API
  app.get("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const userJobs = await db.query.jobs.findMany({
      where: eq(jobs.userId, req.user.id),
      orderBy: (jobs, { desc }) => [desc(jobs.updatedAt)],
    });

    res.json(userJobs);
  });

  app.post("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const job = await db.insert(jobs).values({
      ...req.body,
      userId: req.user.id,
    }).returning();

    res.json(job[0]);
  });

  app.put("/api/jobs/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const job = await db.update(jobs)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(jobs.id, parseInt(req.params.id)))
      .returning();

    res.json(job[0]);
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    await db.delete(jobs).where(eq(jobs.id, parseInt(req.params.id)));
    res.status(200).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
