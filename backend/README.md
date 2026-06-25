# CampusFlow Backend

Node.js + Express + Supabase (PostgreSQL) API server for the CampusFlow hackathon project.

---

## Prerequisites

- Node.js >= 18
- A [Supabase](https://supabase.com) project

---

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of `supabase/migrations/001_init.sql`.
4. Grab your credentials from **Project Settings → API**:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** secret → `SUPABASE_SERVICE_ROLE_KEY`

> The backend uses the `service_role` key only. Never expose this key on the frontend.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```
PORT=5000

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

N8N_DEADLINE_WEBHOOK=https://your-n8n-instance/webhook/deadline
N8N_NOTICE_WEBHOOK=https://your-n8n-instance/webhook/notice
```

---

## Installation

```bash
cd backend
npm install
```

---

## Run Commands

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

---

## API List

All routes are prefixed with `/api`.

### Health

| Method | Endpoint | Description     |
|--------|----------|-----------------|
| GET    | `/api/`  | Backend Running |

### Student

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| POST   | `/api/student`     | Register student     |
| GET    | `/api/students`    | List all students    |
| GET    | `/api/student/:id` | Get one student      |

**POST /api/student body:**
```json
{
  "name": "Kishan",
  "branch": "CSE",
  "year": 2,
  "subjects": ["Maths", "OS"],
  "phone": "9876543210",
  "gmail": "kishan@gmail.com"
}
```

### Task

| Method | Endpoint        | Description   |
|--------|-----------------|---------------|
| POST   | `/api/task`     | Create task   |
| GET    | `/api/tasks`    | List tasks    |
| PUT    | `/api/task/:id` | Update task   |
| DELETE | `/api/task/:id` | Delete task   |

**POST /api/task body:**
```json
{
  "title": "Submit Assignment",
  "subject": "Maths",
  "description": "Chapter 3 problems",
  "deadline": "2025-08-01T10:00:00Z",
  "reminderTime": "2025-07-31T10:00:00Z",
  "calendar": true,
  "studentId": "<uuid>"
}
```

### Notice

| Method | Endpoint       | Description      |
|--------|----------------|------------------|
| POST   | `/api/notice`  | Create notice    |

**POST /api/notice body:**
```json
{
  "title": "Fest 2025",
  "content": "Annual college fest on August 10th."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notice created successfully",
  "data": { "summary": "Placeholder Summary" }
}
```

---

## Response Format

**Success:**
```json
{ "success": true, "message": "...", "data": {} }
```

**Error:**
```json
{ "success": false, "message": "..." }
```

---

## Folder Structure

```
backend/
  src/
    config/
      supabaseClient.js     Supabase client singleton
    controllers/
      student.controller.js
      task.controller.js
      notice.controller.js
    routes/
      index.js              All routes in one file
    services/
      student.service.js    DB queries for students
      task.service.js       DB queries for tasks
      notice.service.js     DB queries for notices
      webhook.service.js    n8n webhook delivery (Axios)
    middlewares/
      asyncHandler.js       Wraps async controllers
      errorHandler.js       Global error handler
      notFound.js           404 handler
      validate.js           express-validator result checker
    utils/
      response.js           sendSuccess / sendError helpers
    app.js                  Express app wiring
    server.js               HTTP server entry point
  supabase/
    migrations/
      001_init.sql          Full schema — run once in Supabase SQL Editor
  .env.example
  package.json
  README.md
```
