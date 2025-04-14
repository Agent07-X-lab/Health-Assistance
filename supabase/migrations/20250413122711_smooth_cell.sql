/*
  # Fix patient predictive analysis policies

  1. Changes
    - Remove direct access to users table from RLS policies
    - Update policies to use auth.uid() and auth.jwt() for role checks
    - Simplify policy conditions for better performance

  2. Security
    - Maintain data access restrictions based on user role and patient ownership
    - Ensure users can only access their own data
    - Allow super_admin to access all data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Super admin can view all analysis" ON patient_predictive_analysis;
DROP POLICY IF EXISTS "Users can view their own analysis" ON patient_predictive_analysis;

-- Create new policies with corrected access checks
CREATE POLICY "Enable read access for users own analysis"
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

CREATE POLICY "Enable read access for super admin"
ON patient_predictive_analysis
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'super_admin'
);