/*
  # Fix RLS policies for patients table

  1. Changes
    - Drop existing policies
    - Create new simplified policies that use auth.uid() directly
    - Add proper role-based access control
    - Ensure policies work with both regular users and super admin

  2. Security
    - Maintain data isolation between users
    - Allow super admin access through role check
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for users own data" ON public.patients;
DROP POLICY IF EXISTS "Enable insert for own data" ON public.patients;
DROP POLICY IF EXISTS "Enable update for own data" ON public.patients;
DROP POLICY IF EXISTS "Enable delete for own data" ON public.patients;

-- Create new simplified policies
CREATE POLICY "Enable read access for users own data"
ON public.patients
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.jwt() ->> 'role' = 'super_admin'
  )
);

CREATE POLICY "Enable insert for own data"
ON public.patients
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.jwt() ->> 'role' = 'super_admin'
  )
);

CREATE POLICY "Enable update for own data"
ON public.patients
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.jwt() ->> 'role' = 'super_admin'
  )
);

CREATE POLICY "Enable delete for own data"
ON public.patients
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.jwt() ->> 'role' = 'super_admin'
  )
);

-- Ensure RLS is enabled
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.patients TO authenticated;