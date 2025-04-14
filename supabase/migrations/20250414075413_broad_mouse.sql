/*
  # Fix users table RLS policies

  1. Changes
    - Drop existing policies
    - Create new simplified policies
    - Enable proper access for both regular users and super admin
    
  2. Security
    - Maintain RLS protection
    - Ensure proper access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Super admin can manage all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authentication" ON users;

-- Create new simplified policies
CREATE POLICY "Enable read access for all authenticated users"
ON users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authentication"
ON users
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_app_meta_data->>'role' = 'super_admin'
  )
);

CREATE POLICY "Enable super admin management"
ON users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_app_meta_data->>'role' = 'super_admin'
  )
);