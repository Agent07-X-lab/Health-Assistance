/*
  # Update Locations and Add Hospital Emergency Contacts

  1. Changes
    - Update locations to Indian cities
    - Add hospital emergency contacts
    - Add prescription management
    - Add appointment scheduling

  2. Security
    - Maintain existing RLS policies
    - Add new policies for prescriptions
*/

-- Add hospital emergency contacts
CREATE TABLE IF NOT EXISTS hospital_emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_name text NOT NULL,
  location text NOT NULL,
  emergency_number text NOT NULL,
  ambulance_number text NOT NULL,
  blood_bank_number text,
  created_at timestamptz DEFAULT now()
);

-- Add prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id),
  doctor_id uuid REFERENCES specialists(id),
  prescription_date date NOT NULL,
  diagnosis text NOT NULL,
  medications jsonb NOT NULL,
  instructions text,
  follow_up_date date,
  prescription_image_url text,
  created_at timestamptz DEFAULT now()
);

-- Add appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id),
  specialist_id uuid REFERENCES specialists(id),
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  symptoms text[],
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hospital_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view hospital emergency contacts"
  ON hospital_emergency_contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their prescriptions"
  ON prescriptions FOR SELECT
  TO authenticated
  USING (patient_id IN (
    SELECT id FROM patients WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (patient_id IN (
    SELECT id FROM patients WHERE user_id = auth.uid()
  ));

-- Insert sample hospital emergency contacts
INSERT INTO hospital_emergency_contacts (hospital_name, location, emergency_number, ambulance_number, blood_bank_number) VALUES
  ('Apollo Hospitals', 'Mumbai', '022-2345-6789', '022-2345-6700', '022-2345-6701'),
  ('Fortis Hospital', 'Mumbai', '022-3456-7890', '022-3456-7800', '022-3456-7801'),
  ('Lilavati Hospital', 'Mumbai', '022-4567-8901', '022-4567-8900', '022-4567-8901'),
  ('Apollo Hospitals', 'Delhi', '011-2345-6789', '011-2345-6700', '011-2345-6701'),
  ('Max Super Speciality Hospital', 'Delhi', '011-3456-7890', '011-3456-7800', '011-3456-7801'),
  ('Apollo Hospitals', 'Chennai', '044-2345-6789', '044-2345-6700', '044-2345-6701'),
  ('Global Hospitals', 'Chennai', '044-3456-7890', '044-3456-7800', '044-3456-7801'),
  ('Apollo Gleneagles Hospital', 'Kolkata', '033-2345-6789', '033-2345-6700', '033-2345-6701'),
  ('AMRI Hospitals', 'Kolkata', '033-3456-7890', '033-3456-7800', '033-3456-7801'),
  ('Manipal Hospital', 'Bangalore', '080-2345-6789', '080-2345-6700', '080-2345-6701'),
  ('Narayana Health', 'Bangalore', '080-3456-7890', '080-3456-7800', '080-3456-7801'),
  ('Care Hospitals', 'Hyderabad', '040-2345-6789', '040-2345-6700', '040-2345-6701'),
  ('Yashoda Hospitals', 'Hyderabad', '040-3456-7890', '040-3456-7800', '040-3456-7801');

-- Update existing locations in environmental_data
UPDATE environmental_data
SET location = CASE location
  WHEN 'Mumbai' THEN 'Mumbai'
  WHEN 'Chennai' THEN 'Chennai'
  WHEN 'Kolkata' THEN 'Kolkata'
  ELSE 'Delhi'
END;

-- Add more Indian cities to environmental_data
INSERT INTO environmental_data (location, air_quality, water_quality, pollution_level) VALUES
  ('Bangalore', 75, 82, 68),
  ('Hyderabad', 82, 78, 72),
  ('Pune', 70, 85, 65),
  ('Ahmedabad', 88, 75, 78),
  ('Jaipur', 92, 72, 82),
  ('Lucknow', 95, 70, 85);

-- Update specialists locations
UPDATE specialists
SET location = CASE location
  WHEN 'Mumbai' THEN 'Mumbai'
  WHEN 'Chennai' THEN 'Chennai'
  WHEN 'Kolkata' THEN 'Kolkata'
  ELSE 'Delhi'
END;