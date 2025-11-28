-- Notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('reply', 'badge', 'vote')),
  actor_id uuid references auth.users(id) on delete set null,
  resource_id uuid, -- e.g. reason_id or badge_id
  resource_slug text, -- e.g. question slug for linking
  is_read boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Indexes
create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_is_read_idx on public.notifications(is_read);
