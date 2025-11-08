

-- M6-A: Auth-ready schema (profiles + optional user_id on content)
-- This script is written to be re-runnable (idempotent) where possible.

-- =====================
-- 1) PROFILES TABLE
-- =====================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  display_name text,
  avatar_url text
);

alter table public.profiles enable row level security;

-- Policies: public read; insert/update only by the owner
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='profiles' and policyname='profiles_public_read'
  ) then
    create policy "profiles_public_read"
      on public.profiles for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='profiles' and policyname='profiles_insert_own'
  ) then
    create policy "profiles_insert_own"
      on public.profiles for insert
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='profiles' and policyname='profiles_update_own'
  ) then
    create policy "profiles_update_own"
      on public.profiles for update
      using (auth.uid() = id);
  end if;
end$$;

-- Trigger to auto-create profile rows when users sign up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- =====================
-- 2) REASONS: add optional user_id + (ensure) uid
-- =====================
-- Some earlier migrations may not have a `uid` column; add it if missing to preserve anonymous mode.
-- Also add `user_id` (nullable) for logged-in users.

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='reasons' and column_name='uid'
  ) then
    alter table public.reasons add column uid text null;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='reasons' and column_name='user_id'
  ) then
    alter table public.reasons add column user_id uuid null references auth.users(id) on delete set null;
  end if;
end$$;

create index if not exists reasons_user_id_idx on public.reasons(user_id);
create index if not exists reasons_question_id_idx on public.reasons(question_id);

alter table public.reasons enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='reasons' and policyname='reasons_public_read'
  ) then
    create policy "reasons_public_read"
      on public.reasons for select
      using (true);
  end if;

  -- Insert allowed for logged-in users (must write their own user_id)
  -- OR anonymous users (must leave user_id NULL)
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='reasons' and policyname='reasons_insert_own_or_anon'
  ) then
    create policy "reasons_insert_own_or_anon"
      on public.reasons for insert
      with check (
        (auth.uid() is not null and user_id = auth.uid())
        or (auth.uid() is null and user_id is null)
      );
  end if;
end$$;


-- =====================
-- 3) REASON_VOTES: add optional user_id + (ensure) uid
-- =====================
-- Keep anonymous voting: unique (uid, reason_id) when uid is present.
-- For logged-in users: unique (user_id, reason_id) when user_id is present.

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='reason_votes' and column_name='uid'
  ) then
    alter table public.reason_votes add column uid text null;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='reason_votes' and column_name='user_id'
  ) then
    alter table public.reason_votes add column user_id uuid null references auth.users(id) on delete set null;
  end if;
end$$;

create index if not exists reason_votes_reason_id_idx on public.reason_votes(reason_id);
create index if not exists reason_votes_user_id_idx   on public.reason_votes(user_id);
create index if not exists reason_votes_uid_idx       on public.reason_votes(uid);

-- Partial unique indexes (safe to run if not exists)
create unique index if not exists reason_votes_user_unique
  on public.reason_votes(user_id, reason_id)
  where user_id is not null;

create unique index if not exists reason_votes_uid_unique
  on public.reason_votes(uid, reason_id)
  where uid is not null;

alter table public.reason_votes enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='reason_votes' and policyname='reason_votes_public_read'
  ) then
    create policy "reason_votes_public_read"
      on public.reason_votes for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='reason_votes' and policyname='reason_votes_insert_own_or_anon'
  ) then
    create policy "reason_votes_insert_own_or_anon"
      on public.reason_votes for insert
      with check (
        (auth.uid() is not null and user_id = auth.uid())
        or (auth.uid() is null and user_id is null)
      );
  end if;
end$$;

-- End of M6-A