-- ============================================================
-- CampusFlow — Initial Schema Migration
-- Run this in Supabase SQL Editor (or via supabase db push)
-- ============================================================

-- ── Enum type ─────────────────────────────────────────────
CREATE TYPE task_status AS ENUM ('Pending', 'Completed');

-- ── students ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  branch     TEXT,
  year       INT,
  subjects   TEXT[],
  phone      TEXT        NOT NULL,
  gmail      TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_gmail ON students (gmail);

-- ── tasks ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT        NOT NULL,
  subject       TEXT,
  description   TEXT,
  deadline      TIMESTAMPTZ NOT NULL,
  reminder_time TIMESTAMPTZ,
  calendar      TEXT,
  student_id    UUID        NOT NULL REFERENCES students (id) ON DELETE CASCADE,
  status        task_status NOT NULL DEFAULT 'Pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_student_id ON tasks (student_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status     ON tasks (status);

-- ── notices ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notices (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT        NOT NULL,
  content    TEXT        NOT NULL,
  summary    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
--
-- RLS is intentionally DISABLED here because the backend uses
-- the service-role key which bypasses RLS anyway. For production,
-- enable RLS and add policies per authenticated user:
--
--   ALTER TABLE students ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE tasks    ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE notices  ENABLE ROW LEVEL SECURITY;
--
--   CREATE POLICY "student_own" ON students
--     USING (auth.uid() = id);
-- ============================================================
