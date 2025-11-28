# Online Job Recruitment & Application Portal (Flipkart Internship Task-3)

## Tech Stack
- Frontend: React + Vite, Tailwind CSS, React Router, Axios, JWT
- Backend: Node.js + Express, JWT Auth, Bcrypt, Multer, Helmet, Rate Limiting
- Data Layer: Pluggable storage
  - File-backed storage (default, no external DB required)
  - PostgreSQL/Drizzle (optional)
- Build Tooling: Vite (client), esbuild (server)

## Features
- Roles: Admin, Employer, Applicant
- Auth: Register, Login, Logout, `GET /me` with JWT and HttpOnly cookie
- Employers: Create, edit, delete jobs; view applicants; download resumes
- Applicants: Search jobs, apply to jobs, upload PDF resume, track status
- Admin: Approve employers, manage users/jobs/applications
- Resume security: PDF-only, max 2MB, magic bytes validation, sanitized with `qpdf` if available

## Folder Structure
```
JobRecruitSystem/
  client/              # React app
    src/
      pages/           # Routes
      components/      # UI components
      lib/             # Query client, auth, utils
  server/              # Express API
    index.ts           # Entry, dev server / production static
    routes.ts          # All API routes
    db.ts              # Drizzle/Neon (optional)
    storage.ts         # Storage abstraction selector
    storage.db.ts      # Drizzle-backed storage
    storage.file.ts    # File-backed storage with seed data
    seed.ts            # DB seed (optional)
  shared/              # Zod schemas and types
  vite.config.js       # Vite config (JS)
  tailwind.config.js   # Tailwind config (JS)
```

## Environment Variables
- `NODE_ENV` = `development` or `production`
- `PORT` = server port, default `5000`
- `SESSION_SECRET` = optional JWT secret; defaults to a generated value
- Optional if using Postgres/Drizzle:
  - `DATABASE_URL` = Postgres connection string

## Run in Replit
1. Install dependencies:
   - `npm install`
2. Build client and server:
   - `npm run build`
3. Preview client (static):
   - `npx vite preview --port 5173 --strictPort`
   - Open `http://localhost:5173/`
4. Run full dev server (file-backed storage, no DB needed):
   - `set NODE_ENV=development && node --loader tsx ./server/index.ts`
   - Open `http://localhost:5000/`

## Running with Postgres (optional)
1. Set `DATABASE_URL` to a valid Postgres connection
2. Run migrations: `npx drizzle-kit push`
3. Seed admin: `npx tsx server/seed.ts`
4. Start server: `set NODE_ENV=development && node --loader tsx ./server/index.ts`

## API List
- `POST /api/auth/register` – register applicant/employer
- `POST /api/auth/login` – login, returns `{ user, token }` and sets cookie
- `GET /api/auth/me` – current user
- `POST /api/auth/logout` – clear session
- `GET /api/jobs` – list active jobs with employers
- `GET /api/jobs/:id` – job details with employer
- `POST /api/jobs` – employer-only create
- `PUT /api/jobs/:id` – employer-only update
- `DELETE /api/jobs/:id` – employer/admin delete
- `POST /api/applications/apply/:jobId` – applicant apply
- `GET /api/applications/my` – applicant list
- `GET /api/applications/check/:jobId` – applicant applied?
- `PUT /api/applications/status/:id` – employer update status
- `GET /api/employer/jobs` – employer jobs
- `GET /api/employer/applications?jobId=...` – employer applicants for job
- `POST /api/resume/upload` – applicant upload PDF
- `GET /api/resume/my` – applicant resume
- `DELETE /api/resume/my` – applicant remove resume
- `GET /api/resume/download/:filename` – employer/admin, access controlled
- `GET /api/admin/users` – admin list users
- `PUT /api/admin/users/:id/approve` – admin approve employer
- `DELETE /api/admin/users/:id` – admin delete user
- `GET /api/admin/jobs` – admin list jobs
- `DELETE /api/admin/jobs/:id` – admin delete job
- `GET /api/admin/applications` – admin list applications

## Security Measures
- JWT in HttpOnly cookie and Bearer header supported
- Helmet, rate limiting for auth endpoints
- Multer memoryStorage to inspect magic bytes before write
- PDF-only `file-type` validation and size limit (2MB)
- `uploads/` stored outside public folder with secure names
- `qpdf` sanitize if available; falls back gracefully if not installed
- Employer resume download guarded to only applicants for their jobs

## Default Seed / Sample Data
- File storage mode seeds: Admin, Employer, Applicant and 10 sample jobs
- Client shows fallback jobs if `/api/jobs` is unreachable

## Notes
- MongoDB/Mongoose support can be added; current implementation uses file-backed storage (no DB) or Postgres via Drizzle. If you prefer MongoDB Atlas, provide the connection string and we will switch the storage implementation to Mongoose models.
