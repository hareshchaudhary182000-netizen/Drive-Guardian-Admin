-- ============================================================
-- DriveGuardian Admin — database setup
-- Run this ONCE in the Supabase SQL Editor (Dashboard -> SQL Editor).
--
-- Why: the app's tables use Row Level Security so each driver can only read
-- their OWN rows. The admin panel signs in with the same public anon key, so
-- without these policies an admin would only see their own data. The policies
-- below grant a user whose profiles.role = 'admin' read access to everyone's
-- data (and full control of the ads table).
-- ============================================================

-- 1. Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 2. Read-all policies for admins (idempotent: drop then create).
do $$
declare t text;
begin
  foreach t in array array[
    'profiles', 'feedback', 'partners', 'activity_logs',
    'reports', 'seatbelt_checks', 'monitoring_schedules'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "admin_read_all" on public.%I;', t);
    execute format(
      'create policy "admin_read_all" on public.%I for select using (public.is_admin());',
      t
    );
  end loop;
end $$;

-- 3. Ads: admins get full control (select/insert/update/delete).
alter table public.ads enable row level security;
drop policy if exists "admin_manage_ads" on public.ads;
create policy "admin_manage_ads" on public.ads
  for all using (public.is_admin()) with check (public.is_admin());

-- 4. Promote your admin account (replace the email):
--    update public.profiles set role = 'admin'
--    where id = (select id from auth.users where email = 'admin@example.com');
