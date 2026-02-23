-- Conversation history between admin and client for each request.
create table if not exists public.request_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  sender text not null check (sender in ('admin', 'client', 'system')),
  message text not null,
  email_to text,
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  resend_id text,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists request_messages_request_id_created_at_idx
  on public.request_messages (request_id, created_at desc);

alter table public.request_messages enable row level security;

drop policy if exists "request_messages_admin_select" on public.request_messages;
create policy "request_messages_admin_select"
on public.request_messages
for select
using (
  exists (
    select 1
    from public.admins a
    where a.user_id = auth.uid()
      and a.active = true
  )
);

drop policy if exists "request_messages_admin_insert" on public.request_messages;
create policy "request_messages_admin_insert"
on public.request_messages
for insert
with check (
  exists (
    select 1
    from public.admins a
    where a.user_id = auth.uid()
      and a.active = true
  )
);

drop policy if exists "request_messages_admin_update" on public.request_messages;
create policy "request_messages_admin_update"
on public.request_messages
for update
using (
  exists (
    select 1
    from public.admins a
    where a.user_id = auth.uid()
      and a.active = true
  )
)
with check (
  exists (
    select 1
    from public.admins a
    where a.user_id = auth.uid()
      and a.active = true
  )
);

