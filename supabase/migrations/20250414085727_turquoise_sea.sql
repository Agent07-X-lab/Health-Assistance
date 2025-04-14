/*
  # Fix RLS policies for super admin access

  1. Changes
    - Update RLS policies to properly check for super admin role
    - Use auth.jwt() to check role instead of querying users table
    - Ensure super admin has full access to all data

  2. Security
    - Maintain RLS protection
    - Allow super admin complete access
    - Keep regular user restrictions in place
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own patients" ON patients;
DROP POLICY IF EXISTS "Super admin can view all patients" ON patients;
DROP POLICY IF EXISTS "Enable read access for users own data" ON patients;
DROP POLICY IF EXISTS "Enable insert for own data" ON patients;
DROP POLICY IF EXISTS "Enable update for own data" ON patients;
DROP POLICY IF EXISTS "Enable delete for own data" ON patients;

-- Create new policies with proper super admin access
CREATE POLICY "Enable read access for users and super admin"
ON patients
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  (auth.jwt() ->> 'role')::text = 'super_admin'
);

CREATE POLICY "Enable insert for users and super admin"
ON patients
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id OR
  (auth.jwt() ->> 'role')::text = 'super_admin'
);

CREATE POLICY "Enable update for users and super admin"
ON patients
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

CREATE POLICY "Enable delete for users and super admin"
ON patients
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id OR
  (auth.jwt() ->> 'role')::text = 'super_admin'
);

-- Update the super admin user's role in auth.users
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"super_admin"'
)
WHERE email = 'as4008@srmist.edu.in';

-- Ensure the role is also set in the JWT claims
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{claims}',
  '{"role": "super_admin"}'::jsonb
)
WHERE email = 'as4008@srmist.edu.in';