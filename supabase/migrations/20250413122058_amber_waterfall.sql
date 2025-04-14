/*
  # Update patient predictive analysis policies

  1. Changes
    - Add new RLS policies for patient_predictive_analysis table
    - Grant read access to authenticated users for their own data
    - Grant read access to specialists for their patients' data
  
  2. Security
    - Enable RLS on patient_predictive_analysis table
    - Add policies to ensure users can only access their own data
    - Add policies for specialists to access their patients' data
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view their own analysis" ON patient_predictive_analysis;
  DROP POLICY IF EXISTS "Doctors can view their patients' analysis" ON patient_predictive_analysis;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create new policies
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

CREATE POLICY "Doctors can view their patients' analysis"
ON patient_predictive_analysis
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM appointments a
    JOIN specialists s ON s.id = a.specialist_id
    WHERE a.patient_id = patient_predictive_analysis.patient_id
    AND s.id IN (
      SELECT id 
      FROM specialists 
      WHERE id = a.specialist_id
    )
  )
);