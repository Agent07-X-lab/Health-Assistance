/*
  # Fix patients table RLS policies

  1. Changes
    - Drop existing RLS policies that are causing permission issues
    - Create new simplified RLS policies for patients table
    
  2. Security
    - Enable RLS on patients table
    - Add policies for:
      - Selecting patients (authenticated users can view their own patients)
      - Inserting patients (authenticated users can add their own patients)
      - Updating patients (authenticated users can update their own patients)
      - Deleting patients (authenticated users can delete their own patients)
      - Super admin access (can perform all operations)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Super admin can delete patients" ON patients;
DROP POLICY IF EXISTS "Super admin can insert patients" ON patients;
DROP POLICY IF EXISTS "Super admin can update all patients" ON patients;
DROP POLICY IF EXISTS "Super admin can view all patients" ON patients;
DROP POLICY IF EXISTS "Users can insert their own patients" ON patients;
DROP POLICY IF EXISTS "Users can update their own patients" ON patients;
DROP POLICY IF EXISTS "Users can view their own patients" ON patients;

-- Create new simplified policies
CREATE POLICY "Enable read access for users" ON patients
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'role' = 'super_admin'
  );

CREATE POLICY "Enable insert access for users" ON patients
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'role' = 'super_admin'
  );

CREATE POLICY "Enable update access for users" ON patients
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'role' = 'super_admin'
  );

CREATE POLICY "Enable delete access for users" ON patients
  FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'role' = 'super_admin'
  );