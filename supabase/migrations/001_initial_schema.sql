-- =============================================
-- ClassVoice Initial Schema
-- =============================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- =============================================
-- CENTERS
-- =============================================
create table if not exists centers (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

alter table centers enable row level security;

create policy "owners can manage their center"
  on centers for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- =============================================
-- CLASSROOMS
-- =============================================
create table if not exists classrooms (
  id         uuid primary key default gen_random_uuid(),
  center_id  uuid not null references centers(id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

alter table classrooms enable row level security;

create policy "owners can manage classrooms"
  on classrooms for all
  using (
    exists (
      select 1 from centers
      where centers.id = classrooms.center_id
        and centers.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from centers
      where centers.id = classrooms.center_id
        and centers.owner_id = auth.uid()
    )
  );

-- =============================================
-- CHILDREN
-- =============================================
create table if not exists children (
  id           uuid primary key default gen_random_uuid(),
  classroom_id uuid not null references classrooms(id) on delete cascade,
  name         text not null,
  dob          date,
  parent_emails text[] not null default '{}',
  allergies    text,
  notes        text,
  created_at   timestamptz not null default now()
);

alter table children enable row level security;

create policy "owners can manage children"
  on children for all
  using (
    exists (
      select 1 from classrooms
      join centers on centers.id = classrooms.center_id
      where classrooms.id = children.classroom_id
        and centers.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from classrooms
      join centers on centers.id = classrooms.center_id
      where classrooms.id = children.classroom_id
        and centers.owner_id = auth.uid()
    )
  );

-- =============================================
-- REPORTS
-- =============================================
create table if not exists reports (
  id           uuid primary key default gen_random_uuid(),
  child_id     uuid not null references children(id) on delete cascade,
  teacher_id   uuid not null references auth.users(id),
  audio_url    text,
  transcript   text,
  meals        text not null default '',
  nap          text not null default '',
  activities   text not null default '',
  mood         text not null default '',
  milestones   text not null default '',
  photos       text[] not null default '{}',
  pdf_url      text,
  status       text not null default 'draft' check (status in ('draft', 'sent')),
  parent_token text unique not null default gen_random_uuid()::text,
  report_date  date not null default current_date,
  created_at   timestamptz not null default now()
);

alter table reports enable row level security;

-- Teachers can manage reports for their center's children
create policy "teachers can manage reports"
  on reports for all
  using (
    exists (
      select 1 from children
      join classrooms on classrooms.id = children.classroom_id
      join centers on centers.id = classrooms.center_id
      where children.id = reports.child_id
        and centers.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from children
      join classrooms on classrooms.id = children.classroom_id
      join centers on centers.id = classrooms.center_id
      where children.id = reports.child_id
        and centers.owner_id = auth.uid()
    )
  );

-- Parents can read reports via token (public, no auth required)
create policy "parents can read report by token"
  on reports for select
  using (true);  -- token validation done in app logic via RPC or service role

-- =============================================
-- SUBSCRIPTIONS
-- =============================================
create table if not exists subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  center_id            uuid not null references centers(id) on delete cascade,
  stripe_customer_id   text,
  stripe_sub_id        text,
  status               text not null default 'trialing',
  current_period_end   timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table subscriptions enable row level security;

create policy "owners can read their subscription"
  on subscriptions for select
  using (
    exists (
      select 1 from centers
      where centers.id = subscriptions.center_id
        and centers.owner_id = auth.uid()
    )
  );

-- Service role only for insert/update (done via webhook)
create policy "service role manages subscriptions"
  on subscriptions for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- =============================================
-- INDEXES
-- =============================================
create index if not exists idx_classrooms_center_id on classrooms(center_id);
create index if not exists idx_children_classroom_id on children(classroom_id);
create index if not exists idx_reports_child_id on reports(child_id);
create index if not exists idx_reports_teacher_id on reports(teacher_id);
create index if not exists idx_reports_parent_token on reports(parent_token);
create index if not exists idx_reports_report_date on reports(report_date);
create index if not exists idx_subscriptions_center_id on subscriptions(center_id);

-- =============================================
-- STORAGE BUCKETS (run in Supabase dashboard or via CLI)
-- =============================================
-- insert into storage.buckets (id, name, public)
-- values ('audio', 'audio', false),
--        ('report-photos', 'report-photos', false),
--        ('report-pdfs', 'report-pdfs', false);
