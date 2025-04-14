/*
  # Fix patients table RLS policies

  1. Changes
    - Add policy to allow users to view their own patients
    - Add policy to allow super admins to view all patients

  2. Security
    - Enable RLS on patients table
    - Add policies for read access based on user_id and role
*/

-- First ensure RLS is enabled
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Users can view own patients" ON patients;
DROP POLICY IF EXISTS "Super admin can view all patients" ON patients;

-- Create policy for users to view their own patients
CREATE POLICY "Users can view own patients"
ON patients
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);

-- Create policy for super admins to view all patients
CREATE POLICY "Super admin can view all patients"
ON patients
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'super_admin'
  )
);