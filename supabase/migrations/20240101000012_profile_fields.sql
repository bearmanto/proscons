-- Add age and gender to profiles
alter table public.profiles 
add column if not exists age integer check (age >= 0),
add column if not exists gender text check (gender in ('Laki-laki', 'Perempuan', 'Lainnya'));

-- Update RLS to allow users to update their own profile
-- (Already covered by "profiles_update_own" policy in 0002_m6_auth.sql)
