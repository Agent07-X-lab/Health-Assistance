/*
  # Fix RLS policies for patient predictive analysis

  1. Changes
    - Drop existing RLS policies
    - Create new policies for:
      - Patients to view their own analysis
      - Doctors to view their patients' analysis
    - Use proper table joins and auth.uid()

  2. Security
    - Enable RLS on patient_predictive_analysis table
    - Ensure proper access control through RLS policies
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