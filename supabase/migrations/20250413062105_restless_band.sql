/*
  # Database Schema for AI Patient Monitoring System

  1. Tables
    - patients
      - Personal information
      - Medical history
      - Location data
      - User association
    - environmental_data
      - Location-based environmental metrics
      - Historical tracking

  2. Security
    - RLS enabled for all tables
    - Policies for data access control
    - Indexes for performance optimization
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS environmental_data CASCADE;

-- Create patients table
CREATE TABLE patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer NOT NULL,
  location text NOT NULL,
  condition text NOT NULL,
  last_visit date NOT NULL,
  medical_history jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS for patients
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create policies for patients table
CREATE POLICY "Users can insert their own patients"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patients"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own patients"
  ON patients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create environmental_data table
CREATE TABLE environmental_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  air_quality integer NOT NULL,
  water_quality integer NOT NULL,
  pollution_level integer NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Enable RLS for environmental_data
ALTER TABLE environmental_data ENABLE ROW LEVEL SECURITY;

-- Create policies for environmental_data table
CREATE POLICY "Anyone can view environmental data"
  ON environmental_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can insert environmental data"
  ON environmental_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_location ON patients(location);
CREATE INDEX idx_environmental_data_location ON environmental_data(location);
CREATE INDEX idx_environmental_data_timestamp ON environmental_data(timestamp);