import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["admin", "employer", "applicant"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "reviewed", "accepted", "rejected"]);
export const jobTypeEnum = pgEnum("job_type", ["full-time", "part-time", "contract", "internship", "remote"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("applicant"),
  companyName: text("company_name"),
  companyDescription: text("company_description"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  location: text("location").notNull(),
  salary: text("salary"),
  jobType: jobTypeEnum("job_type").notNull().default("full-time"),
  employerId: varchar("employer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  applicantId: varchar("applicant_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  resumeId: varchar("resume_id").references(() => resumes.id),
  coverLetter: text("cover_letter"),
  status: applicationStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantId: varchar("applicant_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({ jobs: many(jobs), applications: many(applications), resumes: many(resumes) }));
export const jobsRelations = relations(jobs, ({ one, many }) => ({ employer: one(users, { fields: [jobs.employerId], references: [users.id] }), applications: many(applications) }));
export const applicationsRelations = relations(applications, ({ one }) => ({ job: one(jobs, { fields: [applications.jobId], references: [jobs.id] }), applicant: one(users, { fields: [applications.applicantId], references: [users.id] }), resume: one(resumes, { fields: [applications.resumeId], references: [resumes.id] }) }));
export const resumesRelations = relations(resumes, ({ one }) => ({ applicant: one(users, { fields: [resumes.applicantId], references: [users.id] }) }));

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, isApproved: true });
export const loginSchema = z.object({ email: z.string().email("Invalid email address"), password: z.string().min(6, "Password must be at least 6 characters") });
export const registerSchema = insertUserSchema.extend({ email: z.string().email("Invalid email address"), password: z.string().min(6, "Password must be at least 6 characters"), name: z.string().min(2, "Name must be at least 2 characters"), role: z.enum(["employer", "applicant"]), companyName: z.string().optional(), companyDescription: z.string().optional() });
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, employerId: true, createdAt: true, isActive: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, applicantId: true, status: true, createdAt: true, updatedAt: true });
export const insertResumeSchema = createInsertSchema(resumes).omit({ id: true, applicantId: true, uploadedAt: true });
