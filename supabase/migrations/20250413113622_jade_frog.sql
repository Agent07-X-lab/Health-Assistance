/*
  # Fix patients table RLS policies

  1. Changes
    - Update RLS policies for patients table to fix permission denied error
    - Modify policy to properly handle user authentication without direct users table reference
    
  2. Security
    - Maintain existing RLS enabled status
    - Update policies to use auth.uid() instead of users table reference
    - Ensure proper access control for authenticated users
*/

-- Drop existing policies that reference the users table
DROP POLICY IF EXISTS "Enable read access for users and super admin" ON patients;
DROP POLICY IF EXISTS "Enable insert access for users and super admin" ON patients;
DROP POLICY IF EXISTS "Enable update access for users and super admin" ON patients;
DROP POLICY IF EXISTS "Enable delete access for users and super admin" ON patients;

-- Create new policies using auth.uid()
CREATE POLICY "Enable read access for users" ON patients
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for users" ON patients
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for users" ON patients
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete access for users" ON patients
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);