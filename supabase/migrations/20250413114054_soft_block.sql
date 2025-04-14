/*
  # Add Emergency Services Data

  1. New Tables
    - `emergency_services`
      - `id` (uuid, primary key)
      - `service_type` (text) - Type of emergency service
      - `name` (text) - Name of the service
      - `location` (text) - Service location
      - `contact_numbers` (jsonb) - Emergency contact numbers
      - `available_24x7` (boolean) - 24/7 availability status
      - `services_offered` (text[]) - List of services offered
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `emergency_services` table
    - Add policy for authenticated users to read data
*/

-- Create emergency services table
CREATE TABLE IF NOT EXISTS emergency_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL,
  name text NOT NULL,
  location text NOT NULL,
  contact_numbers jsonb NOT NULL,
  available_24x7 boolean DEFAULT true,
  services_offered text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE emergency_services ENABLE ROW LEVEL SECURITY;

-- Create policy for reading emergency services
CREATE POLICY "Anyone can view emergency services"
  ON emergency_services
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample emergency services data
INSERT INTO emergency_services (
  service_type,
  name,
  location,
  contact_numbers,
  available_24x7,
  services_offered
) VALUES
  (
    'Hospital',
    'Apollo Emergency Care',
    'Mumbai',
    '{
      "emergency": "1800-103-1066",
      "ambulance": "102",
      "reception": "+91-22-12345678"
    }'::jsonb,
    true,
    ARRAY['Trauma Care', 'Cardiac Emergency', 'Stroke Care', 'Critical Care']
  ),
  (
    'Hospital',
    'Fortis Emergency',
    'Delhi',
    '{
      "emergency": "1800-102-4455",
      "ambulance": "102",
      "reception": "+91-11-87654321"
    }'::jsonb,
    true,
    ARRAY['Accident & Trauma', 'Heart Attack', 'Stroke', 'Pediatric Emergency']
  ),
  (
    'Ambulance',
    'Red Cross Ambulance Services',
    'Bangalore',
    '{
      "emergency": "108",
      "dispatch": "+91-80-12345678"
    }'::jsonb,
    true,
    ARRAY['Basic Life Support', 'Advanced Life Support', 'Patient Transport']
  ),
  (
    'Blood Bank',
    'LifeLine Blood Center',
    'Chennai',
    '{
      "emergency": "+91-44-98765432",
      "blood_bank": "+91-44-12345678"
    }'::jsonb,
    true,
    ARRAY['Blood Donation', 'Blood Testing', 'Component Separation', 'Emergency Blood Supply']
  ),
  (
    'Hospital',
    'Max Emergency Care',
    'Delhi',
    '{
      "emergency": "1800-102-5544",
      "ambulance": "102",
      "reception": "+91-11-23456789"
    }'::jsonb,
    true,
    ARRAY['Multi-Trauma Care', 'Cardiac Emergency', 'Neurology Emergency', 'Pediatric Emergency']
  ),
  (
    'Ambulance',
    'Life Savers Ambulance',
    'Mumbai',
    '{
      "emergency": "108",
      "dispatch": "+91-22-87654321"
    }'::jsonb,
    true,
    ARRAY['Advanced Life Support', 'Basic Life Support', 'Neonatal Transport']
  ),
  (
    'Blood Bank',
    'City Blood Services',
    'Bangalore',
    '{
      "emergency": "+91-80-87654321",
      "blood_bank": "+91-80-23456789"
    }'::jsonb,
    true,
    ARRAY['Blood Collection', 'Component Preparation', 'Emergency Supply']
  ),
  (
    'Hospital',
    'Manipal Emergency Care',
    'Bangalore',
    '{
      "emergency": "1800-102-1066",
      "ambulance": "102",
      "reception": "+91-80-34567890"
    }'::jsonb,
    true,
    ARRAY['Trauma Care', 'Stroke Care', 'Cardiac Emergency', 'Critical Care']
  ),
  (
    'Hospital',
    'Apollo Emergency',
    'Chennai',
    '{
      "emergency": "1800-102-1066",
      "ambulance": "102",
      "reception": "+91-44-45678901"
    }'::jsonb,
    true,
    ARRAY['Accident & Trauma', 'Heart Attack', 'Stroke', 'Critical Care']
  ),
  (
    'Ambulance',
    'Emergency Response Team',
    'Kolkata',
    '{
      "emergency": "108",
      "dispatch": "+91-33-12345678"
    }'::jsonb,
    true,
    ARRAY['Advanced Life Support', 'Basic Life Support', 'Patient Transport']
  );