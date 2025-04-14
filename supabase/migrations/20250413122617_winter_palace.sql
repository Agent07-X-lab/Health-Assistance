/*
  # Fix patient predictive analysis permissions

  1. Changes
    - Drop existing policies to avoid conflicts
    - Add policy for patients to view their own analysis
    - Add policy for super admins to view all analysis
    - Enable RLS on the table

  2. Security
    - Maintain RLS protection
    - Ensure proper access control based on user roles and relationships
*/

-- Enable RLS if not already enabled
ALTER TABLE patient_predictive_analysis ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own analysis" ON patient_predictive_analysis;
DROP POLICY IF EXISTS "Doctors can view their patients' analysis" ON patient_predictive_analysis;
DROP POLICY IF EXISTS "Super admin can view all analysis" ON patient_predictive_analysis;

-- Create policy for patients to view their own analysis
CREATE POLICY "Users can view their own analysis"
ON patient_predictive_analysis
FOR SELECT
TO authenticated
USING (
  patient_id IN (
    SELECT id 
    FROM patients 
    WHERE user_id = auth.uid()
  )
);

-- Create policy for super admins to view all analysis
CREATE POLICY "Super admin can view all analysis"
ON patient_predictive_analysis
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'super_admin'
  )
);