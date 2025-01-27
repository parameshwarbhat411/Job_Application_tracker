import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { jobs } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Jobs API
  app.get("/api/jobs", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId || typeof userId !== 'string') {
        return res.status(401).send("Not authenticated");
      }

      const userJobs = await db.query.jobs.findMany({
        where: eq(jobs.userId, userId),
        orderBy: (jobs, { desc }) => [desc(jobs.updatedAt)],
      });

      res.json(userJobs);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      res.status(500).send(error.message || "Failed to fetch jobs");
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId || typeof userId !== 'string') {
        return res.status(401).send("Not authenticated");
      }

      const [job] = await db.insert(jobs).values({
        ...req.body,
        userId: userId,
        applicationDate: new Date(req.body.applicationDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      res.json(job);
    } catch (error: any) {
      console.error('Error creating job:', error);
      res.status(500).send(error.message || "Failed to create job");
    }
  });

  app.put("/api/jobs/:id", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId || typeof userId !== 'string') {
        return res.status(401).send("Not authenticated");
      }

      const [job] = await db.update(jobs)
        .set({ 
          ...req.body, 
          applicationDate: new Date(req.body.applicationDate),
          updatedAt: new Date() 
        })
        .where(eq(jobs.id, parseInt(req.params.id)))
        .returning();

      res.json(job);
    } catch (error: any) {
      console.error('Error updating job:', error);
      res.status(500).send(error.message || "Failed to update job");
    }
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId || typeof userId !== 'string') {
        return res.status(401).send("Not authenticated");
      }

      await db.delete(jobs)
        .where(eq(jobs.id, parseInt(req.params.id)));

      res.status(200).send("Job deleted successfully");
    } catch (error: any) {
      console.error('Error deleting job:', error);
      res.status(500).send(error.message || "Failed to delete job");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}