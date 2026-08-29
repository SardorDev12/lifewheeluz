create extension if not exists pgcrypto;

create type public.goal_status as enum ('draft','active','paused','achieved','abandoned','archived');
create type public.item_status as enum ('pending','active','completed','skipped','paused','archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale text not null default 'uz' check (locale in ('uz','en','ru')),
  timezone text not null default 'Asia/Tashkent',
  week_starts_on smallint not null default 1 check (week_starts_on between 0 and 6),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.life_areas (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  system_key text, custom_label text, color text not null, sort_order smallint not null default 0,
  is_active boolean not null default true, created_at timestamptz not null default now(),
  check (system_key is not null or custom_label is not null)
);

create table public.assessments (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  note text, completed_at timestamptz not null default now()
);
create table public.assessment_scores (
  id uuid primary key default gen_random_uuid(), assessment_id uuid not null references public.assessments(id) on delete cascade,
  life_area_id uuid not null references public.life_areas(id), score smallint not null check (score between 1 and 10),
  note text, plus_one_definition text, unique (assessment_id, life_area_id)
);

create table public.goals (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180), description text, motivation text,
  horizon_years numeric(4,1), target_date date, measure_mode text not null default 'milestone',
  baseline numeric, target numeric, unit text, manual_progress smallint check (manual_progress between 0 and 100),
  confidence smallint check (confidence between 1 and 10), status public.goal_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.goal_life_areas (
  goal_id uuid not null references public.goals(id) on delete cascade,
  life_area_id uuid not null references public.life_areas(id), is_primary boolean not null default false,
  primary key (goal_id, life_area_id)
);
create table public.milestones (
  id uuid primary key default gen_random_uuid(), goal_id uuid not null references public.goals(id) on delete cascade,
  title text not null, due_date date, weight numeric(5,2), sort_order smallint not null default 0,
  status public.item_status not null default 'pending', created_at timestamptz not null default now()
);
create table public.actions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  milestone_id uuid references public.milestones(id) on delete set null, title text not null,
  recurrence_rule text, starts_on date, due_at timestamptz, status public.item_status not null default 'active',
  created_at timestamptz not null default now()
);
create table public.action_occurrences (
  id uuid primary key default gen_random_uuid(), action_id uuid not null references public.actions(id) on delete cascade,
  scheduled_at timestamptz not null, completed_at timestamptz, skipped_at timestamptz, rescheduled_to timestamptz,
  note text, unique (action_id, scheduled_at)
);
create table public.progress_entries (
  id uuid primary key default gen_random_uuid(), goal_id uuid not null references public.goals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, occurred_at timestamptz not null default now(),
  value numeric, note text
);
create table public.reviews (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  cadence text not null check (cadence in ('weekly','monthly','quarterly')), period_start date not null,
  period_end date not null, answers jsonb not null default '{}', completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index life_areas_user_idx on public.life_areas(user_id, is_active, sort_order);
create index assessments_user_idx on public.assessments(user_id, completed_at desc);
create index goals_user_idx on public.goals(user_id, status, target_date);
create index actions_user_due_idx on public.actions(user_id, status, due_at);
create index occurrences_action_schedule_idx on public.action_occurrences(action_id, scheduled_at);
create index reviews_user_period_idx on public.reviews(user_id, period_start desc);

alter table public.profiles enable row level security;
alter table public.life_areas enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_scores enable row level security;
alter table public.goals enable row level security;
alter table public.goal_life_areas enable row level security;
alter table public.milestones enable row level security;
alter table public.actions enable row level security;
alter table public.action_occurrences enable row level security;
alter table public.progress_entries enable row level security;
alter table public.reviews enable row level security;

create policy "profiles own rows" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "life areas own rows" on public.life_areas for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "assessments own rows" on public.assessments for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "scores through assessment" on public.assessment_scores for all using (exists(select 1 from public.assessments a where a.id=assessment_id and a.user_id=auth.uid())) with check (exists(select 1 from public.assessments a where a.id=assessment_id and a.user_id=auth.uid()));
create policy "goals own rows" on public.goals for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "goal areas through goal" on public.goal_life_areas for all using (exists(select 1 from public.goals g where g.id=goal_id and g.user_id=auth.uid())) with check (exists(select 1 from public.goals g where g.id=goal_id and g.user_id=auth.uid()));
create policy "milestones through goal" on public.milestones for all using (exists(select 1 from public.goals g where g.id=goal_id and g.user_id=auth.uid())) with check (exists(select 1 from public.goals g where g.id=goal_id and g.user_id=auth.uid()));
create policy "actions own rows" on public.actions for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "occurrences through action" on public.action_occurrences for all using (exists(select 1 from public.actions a where a.id=action_id and a.user_id=auth.uid())) with check (exists(select 1 from public.actions a where a.id=action_id and a.user_id=auth.uid()));
create policy "progress own rows" on public.progress_entries for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "reviews own rows" on public.reviews for all using (user_id=auth.uid()) with check (user_id=auth.uid());

insert into storage.buckets (id, name, public) values ('user-files','user-files',false) on conflict (id) do nothing;
create policy "user files select" on storage.objects for select using (bucket_id='user-files' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "user files insert" on storage.objects for insert with check (bucket_id='user-files' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "user files update" on storage.objects for update using (bucket_id='user-files' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "user files delete" on storage.objects for delete using (bucket_id='user-files' and (storage.foldername(name))[1]=auth.uid()::text);

