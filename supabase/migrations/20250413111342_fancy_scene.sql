/*
  # Add Lab Tests Table

  1. New Tables
    - `lab_tests`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `description` (text)
      - `preparation` (text)
      - `duration` (text)
      - `cost` (numeric)
      - `locations` (text[])
      - `required_fasting` (boolean)
      - `report_time` (text)
      - `recommended_for` (text[])
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `lab_tests` table
    - Add policy for authenticated users to read lab tests
*/

CREATE TABLE IF NOT EXISTS lab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  preparation text NOT NULL,
  duration text NOT NULL,
  cost numeric NOT NULL,
  locations text[] NOT NULL,
  required_fasting boolean DEFAULT false,
  report_time text NOT NULL,
  recommended_for text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lab tests"
  ON lab_tests
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample lab tests
INSERT INTO lab_tests (name, category, description, preparation, duration, cost, locations, required_fasting, report_time, recommended_for) VALUES
  (
    'Complete Blood Count (CBC)',
    'Hematology',
    'Comprehensive blood test that measures different components of your blood',
    'No special preparation required. However, fasting may be required for accurate results.',
    '15-30 minutes',
    1200,
    ARRAY['Mumbai', 'Delhi', 'Bangalore'],
    true,
    '24 hours',
    ARRAY['Annual checkup', 'Anemia', 'Infection screening']
  ),
  (
    'Lipid Profile',
    'Biochemistry',
    'Measures different types of cholesterol and triglycerides in your blood',
    'Fasting for 9-12 hours before the test. Only water is allowed.',
    '20-30 minutes',
    1500,
    ARRAY['Mumbai', 'Delhi', 'Chennai'],
    true,
    '24 hours',
    ARRAY['Heart disease risk', 'Diabetes', 'High blood pressure']
  ),
  (
    'Thyroid Function Test',
    'Endocrinology',
    'Measures thyroid hormone levels to check thyroid gland function',
    'No special preparation required. Can be done any time of the day.',
    '15-20 minutes',
    1800,
    ARRAY['Mumbai', 'Bangalore', 'Kolkata'],
    false,
    '48 hours',
    ARRAY['Thyroid disorders', 'Fatigue', 'Weight changes']
  );