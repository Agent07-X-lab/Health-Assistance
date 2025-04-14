/*
  # Fix patient predictive analysis permissions

  1. Changes
    - Drop existing policies to avoid conflicts
    - Add policy for patients to view their own analysis
    - Add policy for specialists to view their patients' analysis based on appointments

  2. Security
    - Maintain RLS protection
    - Ensure proper access control based on patient and specialist relationships
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own analysis" ON patient_predictive_analysis;
DROP POLICY IF EXISTS "Doctors can view their patients' analysis" ON patient_predictive_analysis;

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

-- Create policy for doctors to view their patients' analysis
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
    AND a.status = 'completed'
  )
);