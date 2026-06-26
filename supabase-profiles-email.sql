-- ============================================================
-- Sync driver EMAIL into public.profiles
-- Run ONCE in the Supabase SQL Editor.
--
-- The email lives in auth.users (not profiles). This adds a profiles.email
-- column, backfills it, and keeps it in sync — WITHOUT ever inserting into
-- profiles from the auth trigger (so it can never break sign-up).
-- ============================================================

-- 1. Add the column.
alter table public.profiles add column if not exists email text;

-- 2. Backfill existing rows from auth.users.
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id
  and p.email is distinct from u.email;

-- 3. When a NEW profile row is created, fill its email from auth.users.
--    (BEFORE INSERT so it works whoever creates the profile.)
create or replace function public.set_profile_email_on_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null then
    select email into new.email from auth.users where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_set_email on public.profiles;
create trigger profiles_set_email
before insert on public.profiles
for each row execute function public.set_profile_email_on_insert();

-- 4. When a user CHANGES their email, update the existing profile row.
--    (UPDATE-only — never inserts, so sign-up is never affected.)
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_sync on auth.users;
create trigger on_auth_user_email_sync
after update of email on auth.users
for each row execute function public.sync_profile_email();
