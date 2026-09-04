-- Phase 1 backend for the Pro tier: mirrors the app's actual flat runtime
-- data model (Goal/Review/DraftState in packages/shared/src/types.ts),
-- not the richer normalized model in ../schema.sql (profiles/life_areas/
-- assessments/goals/milestones/actions/...), which predates this app's
-- current data model and nothing here implements. Adopting that richer
-- shape is a separate product decision (how granular do goals/actions
-- get?), left for later — this migration is a backend for what the app
-- actually does today. A row only exists here for an account that has
-- upgraded to Pro; free-tier users never touch this schema at all (their
-- data stays in local/AsyncStorage).

create extension if not exists pgcrypto;

-- One row per Pro user. Created on upgrade, not on signup — see
-- packages/shared/src/entitlement.ts's migrateLocalToCloud.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Aziz Karimov',
  email text not null,
  locale text not null default 'uz' check (locale in ('uz', 'en', 'ru')),
  tier text not null default 'pro' check (tier in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per user: the 8 wheel-of-life scores, in the same order as
-- packages/shared/src/i18n/areaLabels.ts (health, career, finance,
-- relations, family, growth, fun, environment).
create table public.wheel_scores (
  user_id uuid primary key references auth.users(id) on delete cascade,
  scores smallint[] not null check (array_length(scores, 1) = 8),
  updated_at timestamptz not null default now()
);

-- Mirrors the Goal type 1:1. parent_id's own cascade gives free
-- descendant-delete at the DB level; the client's descendantIds() walk
-- (packages/shared/src/domain/goalTree.ts) stays for local-tier display
-- and rollup, not for driving deletes once a user is on Pro.
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.goals(id) on delete cascade,
  area smallint not null check (area between 0 and 7),
  title text not null,
  progress smallint not null default 0 check (progress between 0 and 100),
  year text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

-- Mirrors the Review type 1:1.
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date text not null,
  win text not null,
  lesson text not null,
  next text not null,
  created_at timestamptz not null default now()
);

create index goals_user_idx on public.goals(user_id);
create index goals_parent_idx on public.goals(parent_id);
create index reviews_user_created_idx on public.reviews(user_id, created_at desc);

-- Row-level security: every table is scoped to auth.uid(), enabled from
-- the start (never bolted on after) since this is real multi-tenant data.
alter table public.profiles enable row level security;
alter table public.wheel_scores enable row level security;
alter table public.goals enable row level security;
alter table public.reviews enable row level security;

create policy "profiles: owner only" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

create policy "wheel_scores: owner only" on public.wheel_scores
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "goals: owner only" on public.goals
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "reviews: owner only" on public.reviews
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
