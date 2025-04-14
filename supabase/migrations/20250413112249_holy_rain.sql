/*
  # Create appointment requests table

  1. New Tables
    - `appointment_requests`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients.id)
      - `specialist_id` (uuid, references specialists.id)
      - `requested_date` (date)
      - `requested_time` (time)
      - `symptoms` (text[])
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `appointment_requests` table
    - Add policies for:
      - Patients to read their own requests
      - Specialists to read requests assigned to them
      - Patients to create new requests
      - Both patients and specialists to update request status
*/

CREATE TABLE IF NOT EXISTS appointment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id),
  specialist_id uuid REFERENCES specialists(id),
  requested_date date NOT NULL,
  requested_time time NOT NULL,
  symptoms text[] NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE appointment_requests ENABLE ROW LEVEL SECURITY;

-- Patients can read their own requests
CREATE POLICY "Patients can view their appointment requests"
  ON appointment_requests
  FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients 
      WHERE user_id = auth.uid()
    )
  );

-- Specialists can read requests assigned to them
CREATE POLICY "Specialists can view their appointment requests"
  ON appointment_requests
  FOR SELECT
  TO authenticated
  USING (
    specialist_id IN (
      SELECT id FROM specialists 
      WHERE id = specialist_id
    )
  );

-- Patients can create new requests
CREATE POLICY "Patients can create appointment requests"
  ON appointment_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    patient_id IN (
      SELECT id FROM patients 
      WHERE user_id = auth.uid()
    )
  );

-- Both patients and specialists can update request status
CREATE POLICY "Users can update appointment request status"
  ON appointment_requests
  FOR UPDATE
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients 
      WHERE user_id = auth.uid()
    )
    OR
    specialist_id IN (
      SELECT id FROM specialists 
      WHERE id = specialist_id
    )
  )
  WITH CHECK (
    patient_id IN (
      SELECT id FROM patients 
      WHERE user_id = auth.uid()
    )
    OR
    specialist_id IN (
      SELECT id FROM specialists 
      WHERE id = specialist_id
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointment_requests_patient_id ON appointment_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointment_requests_specialist_id ON appointment_requests(specialist_id);
CREATE INDEX IF NOT EXISTS idx_appointment_requests_status ON appointment_requests(status);