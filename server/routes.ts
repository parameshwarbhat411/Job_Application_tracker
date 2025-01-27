import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { jobs } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Jobs API
  app.get("/api/jobs", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).send("Not authenticated");
    }

    const userJobs = await db.query.jobs.findMany({
      where: eq(jobs.userId, userId as string),
      orderBy: (jobs, { desc }) => [desc(jobs.updatedAt)],
    });

    res.json(userJobs);
  });

  app.post("/api/jobs", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).send("Not authenticated");
    }

    const job = await db.insert(jobs).values({
      ...req.body,
      userId: userId as string,
    }).returning();

    res.json(job[0]);
  });

  app.put("/api/jobs/:id", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).send("Not authenticated");
    }

    const job = await db.update(jobs)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(jobs.id, parseInt(req.params.id)))
      .returning();

    res.json(job[0]);
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).send("Not authenticated");
    }

    await db.delete(jobs).where(eq(jobs.id, parseInt(req.params.id)));
    res.status(200).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}