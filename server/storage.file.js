import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
// schema import not required in file storage, using plain objects

const dataPath = path.join(process.cwd(), ".local", "state", "data.json");

function ensureStore() {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  if (!fs.existsSync(dataPath)) {
    const admin = { id: randomUUID(), email: "admin@jobconnect.com", password: "$2a$10$cV1rFJvKZlqE3iGzWkqvgeFQxHcq7vK7J3NkfZ9bM1GgVZf3K7bQG", name: "Admin", role: "admin", isApproved: true, createdAt: new Date() };
    const employer = { id: randomUUID(), email: "employer@jobconnect.com", password: "$2a$10$cV1rFJvKZlqE3iGzWkqvgeFQxHcq7vK7J3NkfZ9bM1GgVZf3K7bQG", name: "Top Employer", role: "employer", companyName: "Tech Corp", companyDescription: "Leading tech company", isApproved: true, createdAt: new Date() };
    const applicant = { id: randomUUID(), email: "applicant@jobconnect.com", password: "$2a$10$cV1rFJvKZlqE3iGzWkqvgeFQxHcq7vK7J3NkfZ9bM1GgVZf3K7bQG", name: "Demo Applicant", role: "applicant", isApproved: true, createdAt: new Date() };
    const jobs = [
      { id: randomUUID(), title: "Frontend Developer", description: "Build UI with React", requirements: "React, TypeScript, CSS", location: "Remote", salary: "$70k-$90k", jobType: "full-time", employerId: employer.id, isActive: true, createdAt: new Date() },
      { id: randomUUID(), title: "Backend Developer", description: "Build APIs with Node", requirements: "Node, PostgreSQL", location: "Remote", salary: "$80k-$100k", jobType: "full-time", employerId: employer.id, isActive: true, createdAt: new Date() },
      { id: randomUUID(), title: "Data Scientist", description: "Build ML models and analytics", requirements: "Python, Pandas, scikit-learn", location: "Hybrid", salary: "$95k-$130k", jobType: "full-time", employerId: employer.id, isActive: true, createdAt: new Date() },
      { id: randomUUID(), title: "DevOps Engineer", description: "Automate deployments and infrastructure", requirements: "Docker, Kubernetes, CI/CD", location: "Remote", salary: "$100k-$140k", jobType: "full-time", employerId: employer.id, isActive: true, createdAt: new Date() },
      { id: randomUUID(), title: "Product Manager", description: "Lead product vision and execution", requirements: "Roadmaps, user research, analytics", location: "Onsite", salary: "$110k-$150k", jobType: "full-time", employerId: employer.id, isActive: true, createdAt: new Date() },
      { id: randomUUID(), title: "UI/UX Designer", description: "Design intuitive user experiences", requirements: "Figma, prototyping, user testing", location: "Remote", salary: "$70k-$100k", jobType: "contract", employerId: employer.id, isActive: true, createdAt: new Date() },
      { id: randomUUID(), title: "QA Engineer", description: "Ensure software quality", requirements: "Testing frameworks, automation", location: "Hybrid", salary: "$60k-$90k", jobType: "part-time", employerId: employer.id, isActive: true, createdAt: new Date() },
      { id: randomUUID(), title: "Mobile Developer", description: "Build iOS and Android apps", requirements: "React Native or Flutter", location: "Remote", salary: "$90k-$120k", jobType: "full-time", employerId: employer.id, isActive: true, createdAt: new Date() },
      { id: randomUUID(), title: "Full-stack Developer", description: "Build end-to-end features", requirements: "React, Node, SQL", location: "Remote", salary: "$100k-$130k", jobType: "full-time", employerId: employer.id, isActive: true, createdAt: new Date() },
      { id: randomUUID(), title: "Cloud Architect", description: "Design scalable cloud solutions", requirements: "AWS, Azure, GCP", location: "Remote", salary: "$130k-$170k", jobType: "full-time", employerId: employer.id, isActive: true, createdAt: new Date() },
    ];
    const store = { users: [admin, employer, applicant], jobs, applications: [], resumes: [] };
    fs.writeFileSync(dataPath, JSON.stringify(store));
  }
}

function save(store) {
  fs.writeFileSync(dataPath, JSON.stringify(store));
}

function load() {
  ensureStore();
  const raw = fs.readFileSync(dataPath, "utf-8");
  const parsed = JSON.parse(raw);
  parsed.users.forEach((u) => (u.createdAt = new Date(u.createdAt)));
  parsed.jobs.forEach((j) => (j.createdAt = new Date(j.createdAt)));
  parsed.applications.forEach((a) => {
    a.createdAt = new Date(a.createdAt);
    a.updatedAt = new Date(a.updatedAt);
  });
  parsed.resumes.forEach((r) => (r.uploadedAt = new Date(r.uploadedAt)));
  return parsed;
}

export class FileStorage {
  constructor() {
    this.store = load();
  }
  async getUser(id) { return this.store.users.find((u) => u.id === id); }
  async getUserByEmail(email) { return this.store.users.find((u) => u.email === email); }
  async createUser(user) { const newUser = { ...user, id: randomUUID(), createdAt: new Date(), isApproved: user.role === "employer" ? false : true }; this.store.users.push(newUser); save(this.store); return newUser; }
  async updateUser(id, data) { const idx = this.store.users.findIndex((u) => u.id === id); if (idx === -1) return undefined; this.store.users[idx] = { ...this.store.users[idx], ...data }; save(this.store); return this.store.users[idx]; }
  async deleteUser(id) { this.store.users = this.store.users.filter((u) => u.id !== id); save(this.store); }
  async getAllUsers() { return [...this.store.users].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); }
  async getJob(id) { return this.store.jobs.find((j) => j.id === id); }
  async getJobWithEmployer(id) { const job = await this.getJob(id); if (!job) return undefined; const employer = await this.getUser(job.employerId); if (!employer) return undefined; return { ...job, employer }; }
  async getAllJobs() { return this.store.jobs.filter((j) => j.isActive).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); }
  async getAllJobsWithEmployers() { const jobs = await this.getAllJobs(); return Promise.all(jobs.map(async (j) => ({ ...j, employer: (await this.getUser(j.employerId)) }))); }
  async getJobsByEmployer(employerId) { return this.store.jobs.filter((j) => j.employerId === employerId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); }
  async createJob(job) { const newJob = { ...job, id: randomUUID(), isActive: true, createdAt: new Date() }; this.store.jobs.push(newJob); save(this.store); return newJob; }
  async updateJob(id, data) { const idx = this.store.jobs.findIndex((j) => j.id === id); if (idx === -1) return undefined; this.store.jobs[idx] = { ...this.store.jobs[idx], ...data }; save(this.store); return this.store.jobs[idx]; }
  async deleteJob(id) { this.store.jobs = this.store.jobs.filter((j) => j.id !== id); this.store.applications = this.store.applications.filter((a) => a.jobId !== id); save(this.store); }
  async getApplication(id) { return this.store.applications.find((a) => a.id === id); }
  async getApplicationWithDetails(id) { const app = await this.getApplication(id); if (!app) return undefined; const job = (await this.getJob(app.jobId)); const employer = job ? (await this.getUser(job.employerId)) : null; const applicant = (await this.getUser(app.applicantId)); const resume = app.resumeId ? (await this.getResume(app.resumeId)) : null; return { ...app, job: job && employer ? { ...job, employer } : job, applicant, resume }; }
  async getApplicationsByApplicant(applicantId) { const apps = this.store.applications.filter((a) => a.applicantId === applicantId); const list = await Promise.all(apps.map((a) => this.getApplicationWithDetails(a.id))); return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); }
  async getApplicationsByJob(jobId) { const apps = this.store.applications.filter((a) => a.jobId === jobId); const list = await Promise.all(apps.map((a) => this.getApplicationWithDetails(a.id))); return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); }
  async createApplication(application) { const newApp = { ...application, id: randomUUID(), status: "pending", createdAt: new Date(), updatedAt: new Date() }; this.store.applications.push(newApp); save(this.store); return newApp; }
  async updateApplicationStatus(id, status) { const idx = this.store.applications.findIndex((a) => a.id === id); if (idx === -1) return undefined; this.store.applications[idx] = { ...this.store.applications[idx], status, updatedAt: new Date() }; save(this.store); return this.store.applications[idx]; }
  async hasApplied(applicantId, jobId) { return this.store.applications.some((a) => a.applicantId === applicantId && a.jobId === jobId); }
  async getAllApplications() { return [...this.store.applications].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); }
  async getResume(id) { return this.store.resumes.find((r) => r.id === id); }
  async getResumeByApplicant(applicantId) { return this.store.resumes.find((r) => r.applicantId === applicantId); }
  async getResumeByFilename(filename) { return this.store.resumes.find((r) => r.filename === filename); }
  async createResume(resume) { const newResume = { ...resume, id: randomUUID(), uploadedAt: new Date() }; this.store.resumes.push(newResume); save(this.store); return newResume; }
  async deleteResume(id) { this.store.resumes = this.store.resumes.filter((r) => r.id !== id); save(this.store); }
}
