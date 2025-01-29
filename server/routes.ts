import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { jobs } from "@db/schema";
import { eq } from "drizzle-orm";
import fetch from "node-fetch";

export function registerRoutes(app: Express): Server {
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

      // Create a Date object at noon UTC to avoid timezone issues
      const jobData = {
        ...req.body,
        userId: userId,
        applicationDate: req.body.applicationDate 
          ? new Date(req.body.applicationDate + 'T12:00:00.000Z')
          : null,
        interviewDate: req.body.interviewDate 
          ? new Date(req.body.interviewDate + 'T12:00:00.000Z')
          : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [job] = await db.insert(jobs)
        .values(jobData)
        .returning();

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

      const jobData = {
        ...req.body,
        applicationDate: req.body.applicationDate 
          ? new Date(req.body.applicationDate + 'T12:00:00.000Z')
          : null,
        interviewDate: req.body.interviewDate 
          ? new Date(req.body.interviewDate + 'T12:00:00.000Z')
          : null,
        updatedAt: new Date()
      };

      const [job] = await db.update(jobs)
        .set(jobData)
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

  app.post("/api/search-recruiters", async (req, res) => {
    try {
      const { companyName } = req.body;
      if (!companyName) {
        return res.status(400).json({ error: "Company name is required" });
      }

      if (!process.env.APOLLO_API_KEY) {
        return res.status(500).json({ error: "Apollo API key is not configured" });
      }

      // First, search for the company to get its domain
      const companySearchResponse = await fetch("https://api.apollo.io/v1/mixed_companies/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Api-Key": process.env.APOLLO_API_KEY,
        },
        body: JSON.stringify({
          q_organization_name: companyName,
          page: 1,
          per_page: 1,
        }),
      });

      if (!companySearchResponse.ok) {
        const errorText = await companySearchResponse.text();
        console.error("Apollo API Error:", {
          status: companySearchResponse.status,
          statusText: companySearchResponse.statusText,
          response: errorText
        });
        throw new Error(`Apollo API error: ${companySearchResponse.status} ${companySearchResponse.statusText}`);
      }

      const companyData = await companySearchResponse.json();

      if (!companyData.organizations?.length) {
        return res.json({ message: "No company found", recruiters: [] });
      }

      const domain = companyData.organizations[0].primary_domain;
      if (!domain) {
        return res.json({ message: "Company found but no domain available", recruiters: [] });
      }

      // Now search for recruiters at this company
      const recruiterSearchResponse = await fetch("https://api.apollo.io/v1/mixed_people/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Api-Key": process.env.APOLLO_API_KEY,
        },
        body: JSON.stringify({
          q_organization_domains: [domain],
          person_titles: ["recruiter", "talent acquisition", "hr manager"],
          page: 1,
          per_page: 10,
        }),
      });

      if (!recruiterSearchResponse.ok) {
        const errorText = await recruiterSearchResponse.text();
        console.error("Apollo API Error (recruiter search):", {
          status: recruiterSearchResponse.status,
          statusText: recruiterSearchResponse.statusText,
          response: errorText
        });
        throw new Error(`Apollo API error: ${recruiterSearchResponse.status} ${recruiterSearchResponse.statusText}`);
      }

      const recruiterData = await recruiterSearchResponse.json();
      const recruiters = recruiterData.people?.map((person: any) => ({
        name: `${person.first_name} ${person.last_name}`,
        title: person.title,
        email: person.email,
        linkedin_url: person.linkedin_url,
        organization_name: person.organization_name,
      })) || [];

      res.json({ message: recruiters.length ? "Recruiters found" : "No recruiters found", recruiters });
    } catch (error: any) {
      console.error("Error searching recruiters:", error);
      res.status(500).json({ 
        error: error.message || "Failed to search recruiters",
        details: error.stack
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}