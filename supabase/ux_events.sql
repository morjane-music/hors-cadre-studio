create extension if not exists pgcrypto;

create table if not exists public.ux_events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  path text,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists ux_events_occurred_at_idx on public.ux_events (occurred_at desc);
create index if not exists ux_events_event_idx on public.ux_events (event);
