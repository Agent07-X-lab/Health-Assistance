/*
  # Fix users table RLS policies

  1. Changes
    - Remove existing RLS policies for users table
    - Add new policies with proper conditions for user creation and management
    
  2. Security
    - Enable RLS on users table
    - Add policies for:
      - Inserting new users (authenticated and anonymous)
      - Reading own user data
      - Super admin management
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authentication" ON public.users;
DROP POLICY IF EXISTS "Super admin can manage all users" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;

-- Create new policies
CREATE POLICY "Enable insert for authentication" ON public.users
FOR INSERT TO anon, authenticated
WITH CHECK (
  (auth.uid() = id) AND (role = 'client')
);

CREATE POLICY "Super admin can manage all users" ON public.users
FOR ALL TO authenticated
USING ((auth.jwt() ->> 'role'::text) = 'super_admin'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'super_admin'::text);

CREATE POLICY "Users can read own data" ON public.users
FOR SELECT TO authenticated
USING (auth.uid() = id);