-- Enable required extensions (pg_trgm for fuzzy search in Story 2.1; tsvector enabled via the extension here)
-- AC #8 requires both pg_trgm and tsvector present after migrations.
-- Note: tsvector is a built-in PostgreSQL type (not an extension) — no CREATE EXTENSION needed.
-- The pg_trgm extension enables trigram GIN indexes. Both are used in catalog search (Story 2.1).
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- profiles table (extended by trigger from auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username VARCHAR(30) UNIQUE,
  username_changed_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  premium_until TIMESTAMPTZ,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for public profile lookup by username
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
