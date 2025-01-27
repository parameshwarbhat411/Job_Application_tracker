import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id", { length: 128 }).primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  companyName: text("company_name").notNull(),
  jobTitle: text("job_title").notNull(),
  location: text("location"),
  salaryMin: text("salary_min"),
  salaryMax: text("salary_max"),
  applicationDate: timestamp("application_date").notNull(),
  interviewDate: timestamp("interview_date"),
  applicationDeadline: timestamp("application_deadline"),
  recruiterStatus: text("recruiter_status").notNull(),
  referralStatus: text("referral_status").notNull(),
  assessmentStatus: text("assessment_status").notNull(),
  interviewStatus: text("interview_status").notNull(),
  applicationStatus: text("application_status").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const jobsRelations = relations(jobs, ({ one }) => ({
  user: one(users, {
    fields: [jobs.userId],
    references: [users.id],
  }),
}));

export const insertJobSchema = createInsertSchema(jobs);
export const selectJobSchema = createSelectSchema(jobs);
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;