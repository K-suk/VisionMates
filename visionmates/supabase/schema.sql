-- Extensions
create extension if not exists pgcrypto;

-- ENUMS
create type if not exists intent_level as enum ('watch','raise','commit');
create type if not exists member_role as enum ('owner','moderator','member');

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  bio text,
  skills text[],
  links jsonb,
  created_at timestamptz default now()
);

-- PROJECTS
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  summary text not null,
  description text,
  looking_for text[],
  needed_skills text[],
  external_links jsonb,
  is_public boolean default true,
  created_at timestamptz default now()
);

-- INTENTS (1 user per project)
create table if not exists public.project_intents (
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  level intent_level not null,
  created_at timestamptz default now(),
  primary key (project_id, user_id)
);

-- MEMBERS
create table if not exists public.project_members (
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role member_role not null default 'member',
  status text not null default 'active',
  created_at timestamptz default now(),
  primary key (project_id, user_id)
);

-- UPDATES
create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

-- COMMENTS
create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

-- TAGS
create table if not exists public.tags (
  id serial primary key,
  name text unique not null
);
create table if not exists public.project_tags (
  project_id uuid references public.projects(id) on delete cascade,
  tag_id int references public.tags(id) on delete cascade,
  primary key(project_id, tag_id)
);

-- NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Indexes for FK lookups
create index if not exists idx_projects_owner on public.projects(owner_id);
create index if not exists idx_intents_user on public.project_intents(user_id);
create index if not exists idx_members_user on public.project_members(user_id);
create index if not exists idx_updates_project on public.project_updates(project_id);
create index if not exists idx_comments_project on public.project_comments(project_id);
create index if not exists idx_notifications_user on public.notifications(user_id);

