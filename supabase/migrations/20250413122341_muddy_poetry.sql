/*
  # Fix permissions for patient predictive analysis

  1. Changes
    - Update RLS policies for patient_predictive_analysis table
    - Add policy for authenticated users to view their own analysis data
    - Add policy for doctors to view their patients' analysis data

  2. Security
    - Ensure patients can only access their own data
    - Allow doctors to access data for their patients
    - Maintain existing RLS enabled status
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
    JOIN patients p ON p.id = a.patient_id
    WHERE 
      a.patient_id = patient_predictive_analysis.patient_id
      AND s.id IN (
        SELECT id 
        FROM specialists 
        WHERE user_id = auth.uid()
      )
  )
);