/*
  # Fix patient table access policies

  1. Changes
    - Update RLS policies for patients table
    - Add proper super admin access
    - Maintain user data isolation
    
  2. Security
    - Enable RLS
    - Add policies for both regular users and super admin
    - Ensure proper access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for users" ON patients;
DROP POLICY IF EXISTS "Enable insert access for users" ON patients;
DROP POLICY IF EXISTS "Enable update access for users" ON patients;
DROP POLICY IF EXISTS "Enable delete access for users" ON patients;

-- Create new policies with super admin access
CREATE POLICY "Enable read access for users and super admin"
ON patients
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_app_meta_data->>'role' = 'super_admin'
  )
);

CREATE POLICY "Enable insert access for users and super admin"
ON patients
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_app_meta_data->>'role' = 'super_admin'
  )
);

CREATE POLICY "Enable update access for users and super admin"
ON patients
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_app_meta_data->>'role' = 'super_admin'
  )
);

CREATE POLICY "Enable delete access for users and super admin"
ON patients
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_app_meta_data->>'role' = 'super_admin'
  )
);