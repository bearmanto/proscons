-- Enable UUID generator
create extension if not exists "pgcrypto";

-- Questions (one active question for now)
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists questions_is_active_created_at_idx
  on public.questions (is_active, created_at desc);

alter table public.questions enable row level security;
-- Public read
create policy if not exists "public_read_questions"
  on public.questions for select using (true);

-- A user's stance on the question (one per user_key)
create table if not exists public.question_votes (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  user_key uuid not null,
  side text not null check (side in ('pro','con')),
  created_at timestamptz not null default now(),
  unique (question_id, user_key)
);
create index if not exists question_votes_question_idx
  on public.question_votes (question_id);

alter table public.question_votes enable row level security;
create policy if not exists "public_read_question_votes"
  on public.question_votes for select using (true);

-- Reasons users submit (flat list)
create table if not exists public.reasons (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  user_key uuid not null,
  side text not null check (side in ('pro','con')),
  body text not null check (char_length(body) between 2 and 500),
  created_at timestamptz not null default now()
);
create index if not exists reasons_q_side_created_idx
  on public.reasons (question_id, side, created_at desc);

alter table public.reasons enable row level security;
create policy if not exists "public_read_reasons"
  on public.reasons for select using (true);

-- Votes on reasons: 👍 = 1, ○ = 0, 👎 = -1 (one per user_key)
create table if not exists public.reason_votes (
  id uuid primary key default gen_random_uuid(),
  reason_id uuid not null references public.reasons(id) on delete cascade,
  user_key uuid not null,
  value smallint not null check (value in (-1,0,1)),
  created_at timestamptz not null default now(),
  unique (reason_id, user_key)
);
create index if not exists reason_votes_reason_idx
  on public.reason_votes (reason_id);

alter table public.reason_votes enable row level security;
create policy if not exists "public_read_reason_votes"
  on public.reason_votes for select using (true);
