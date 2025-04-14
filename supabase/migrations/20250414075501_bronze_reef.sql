/*
  # Fix patients table RLS policies

  1. Changes
    - Update RLS policies for patients table to properly handle role-based access
    - Add policy for super admin access
    - Fix user role check to use auth.jwt() instead of users table

  2. Security
    - Enable RLS on patients table
    - Add policies for:
      - Regular users to access their own data
      - Super admins to access all data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable delete access for users and super admin" ON public.patients;
DROP POLICY IF EXISTS "Enable insert access for users and super admin" ON public.patients;
DROP POLICY IF EXISTS "Enable read access for users and super admin" ON public.patients;
DROP POLICY IF EXISTS "Enable update access for users and super admin" ON public.patients;

-- Create new policies with correct role checks
CREATE POLICY "Enable read access for users own data"
ON public.patients
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  (auth.jwt() ->> 'role')::text = 'super_admin'
);

CREATE POLICY "Enable insert for own data"
ON public.patients
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id OR
  (auth.jwt() ->> 'role')::text = 'super_admin'
);

CREATE POLICY "Enable update for own data"
ON public.patients
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id OR
  (auth.jwt() ->> 'role')::text = 'super_admin'
)
WITH CHECK (
  auth.uid() = user_id OR
  (auth.jwt() ->> 'role')::text = 'super_admin'
);

CREATE POLICY "Enable delete for own data"
ON public.patients
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id OR
  (auth.jwt() ->> 'role')::text = 'super_admin'
);