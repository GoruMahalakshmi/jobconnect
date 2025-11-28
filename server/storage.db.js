import { users, jobs, applications, resumes } from "../shared/schema.js";
import { db } from "./db.js";
import { eq, and, desc } from "drizzle-orm";

export class DatabaseStorage {
  async getUser(id) { const [row] = await db.select().from(users).where(eq(users.id, id)); return row || undefined; }
  async getUserByEmail(email) { const [row] = await db.select().from(users).where(eq(users.email, email)); return row || undefined; }
  async createUser(user) { const [row] = await db.insert(users).values(user).returning(); return row; }
  async updateUser(id, data) { const [row] = await db.update(users).set(data).where(eq(users.id, id)).returning(); return row || undefined; }
  async deleteUser(id) { await db.delete(users).where(eq(users.id, id)); }
  async getAllUsers() { return db.select().from(users).orderBy(desc(users.createdAt)); }
  async getJob(id) { const [row] = await db.select().from(jobs).where(eq(jobs.id, id)); return row || undefined; }
  async getJobWithEmployer(id) { const [jobRow] = await db.select().from(jobs).where(eq(jobs.id, id)); if (!jobRow) return undefined; const [employer] = await db.select().from(users).where(eq(users.id, jobRow.employerId)); return { ...jobRow, employer }; }
  async getAllJobs() { return db.select().from(jobs).where(eq(jobs.isActive, true)).orderBy(desc(jobs.createdAt)); }
  async getAllJobsWithEmployers() { const js = await this.getAllJobs(); const employers = await db.select().from(users).where(and(eq(users.role, "employer"))); const map = new Map(employers.map((e) => [e.id, e])); return js.map((j) => ({ ...j, employer: map.get(j.employerId) })); }
  async getJobsByEmployer(employerId) { return db.select().from(jobs).where(eq(jobs.employerId, employerId)).orderBy(desc(jobs.createdAt)); }
  async createJob(job) { const [row] = await db.insert(jobs).values(job).returning(); return row; }
  async updateJob(id, data) { const [row] = await db.update(jobs).set(data).where(eq(jobs.id, id)).returning(); return row || undefined; }
  async deleteJob(id) { await db.delete(jobs).where(eq(jobs.id, id)); await db.delete(applications).where(eq(applications.jobId, id)); }
  async getApplication(id) { const [row] = await db.select().from(applications).where(eq(applications.id, id)); return row || undefined; }
  async getApplicationWithDetails(id) { const [app] = await db.select().from(applications).where(eq(applications.id, id)); if (!app) return undefined; const [jobRow] = await db.select().from(jobs).where(eq(jobs.id, app.jobId)); const [employer] = jobRow ? await db.select().from(users).where(eq(users.id, jobRow.employerId)) : [null]; const [applicant] = await db.select().from(users).where(eq(users.id, app.applicantId)); const [resume] = app.resumeId ? await db.select().from(resumes).where(eq(resumes.id, app.resumeId)) : [null]; return { ...app, job: jobRow && employer ? { ...jobRow, employer } : jobRow, applicant, resume }; }
  async getApplicationsByApplicant(applicantId) { const apps = await db.select().from(applications).where(eq(applications.applicantId, applicantId)).orderBy(desc(applications.createdAt)); const list = await Promise.all(apps.map((a) => this.getApplicationWithDetails(a.id))); return list; }
  async getApplicationsByJob(jobId) { const apps = await db.select().from(applications).where(eq(applications.jobId, jobId)).orderBy(desc(applications.createdAt)); const list = await Promise.all(apps.map((a) => this.getApplicationWithDetails(a.id))); return list; }
  async createApplication(application) { const [row] = await db.insert(applications).values({ ...application, status: "pending" }).returning(); return row; }
  async updateApplicationStatus(id, status) { const [row] = await db.update(applications).set({ status }).where(eq(applications.id, id)).returning(); return row || undefined; }
  async hasApplied(applicantId, jobId) { const [row] = await db.select().from(applications).where(and(eq(applications.applicantId, applicantId), eq(applications.jobId, jobId))); return !!row; }
  async getAllApplications() { return db.select().from(applications).orderBy(desc(applications.createdAt)); }
  async getResume(id) { const [row] = await db.select().from(resumes).where(eq(resumes.id, id)); return row || undefined; }
  async getResumeByApplicant(applicantId) { const [row] = await db.select().from(resumes).where(eq(resumes.applicantId, applicantId)); return row || undefined; }
  async getResumeByFilename(filename) { const [row] = await db.select().from(resumes).where(eq(resumes.filename, filename)); return row || undefined; }
  async createResume(resume) { const [row] = await db.insert(resumes).values(resume).returning(); return row; }
  async deleteResume(id) { await db.delete(resumes).where(eq(resumes.id, id)); }
}
