/*
  # Enhance Healthcare System

  1. New Tables
    - `live_location_data`
      - Real-time environmental factors for each location
      - Includes air quality, pollution levels, weather conditions
    - `disease_predictions`
      - Detailed disease predictions with symptoms and remedies
    - `doctor_availability`
      - Doctor schedules and availability slots

  2. Changes
    - Add new columns to existing tables
    - Update RLS policies

  3. Security
    - Enable RLS on new tables
    - Add appropriate access policies
*/

-- Create live location data table
CREATE TABLE IF NOT EXISTS live_location_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  air_quality_index numeric NOT NULL,
  pollution_level numeric NOT NULL,
  temperature numeric NOT NULL,
  humidity numeric NOT NULL,
  wind_speed numeric NOT NULL,
  rainfall numeric NOT NULL,
  uv_index numeric NOT NULL,
  pollen_count numeric NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(location)
);

-- Create disease predictions table
CREATE TABLE IF NOT EXISTS disease_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  disease_name text NOT NULL,
  symptoms jsonb NOT NULL,
  risk_factors jsonb NOT NULL,
  home_remedies jsonb NOT NULL,
  prevention_tips jsonb NOT NULL,
  severity_level text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(disease_name)
);

-- Create doctor availability table
CREATE TABLE IF NOT EXISTS doctor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES specialists(id),
  day_of_week text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  max_appointments integer NOT NULL,
  location text NOT NULL,
  is_available boolean DEFAULT true,
  consultation_fee numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, day_of_week)
);

-- Enable RLS
ALTER TABLE live_location_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow read access to live location data"
  ON live_location_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to disease predictions"
  ON disease_predictions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to doctor availability"
  ON doctor_availability
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample disease predictions
INSERT INTO disease_predictions (disease_name, symptoms, risk_factors, home_remedies, prevention_tips, severity_level) 
VALUES 
(
  'Type 2 Diabetes',
  '[
    "Increased thirst",
    "Frequent urination",
    "Increased hunger",
    "Unintended weight loss",
    "Fatigue",
    "Blurred vision"
  ]'::jsonb,
  '[
    "Obesity",
    "Physical inactivity",
    "Family history",
    "Age over 45",
    "High blood pressure"
  ]'::jsonb,
  '[
    {
      "remedy": "Cinnamon tea",
      "instructions": "Add 1 teaspoon of cinnamon powder to hot water, steep for 10 minutes",
      "frequency": "2-3 times daily"
    },
    {
      "remedy": "Fenugreek seeds",
      "instructions": "Soak 2 tablespoons overnight, drink the water in morning",
      "frequency": "Daily"
    },
    {
      "remedy": "Apple cider vinegar",
      "instructions": "Mix 2 tablespoons in water",
      "frequency": "Before meals"
    }
  ]'::jsonb,
  '[
    "Maintain healthy weight",
    "Regular exercise",
    "Balanced diet",
    "Regular health checkups",
    "Monitor blood sugar"
  ]'::jsonb,
  'High'
),
(
  'Hypertension',
  '[
    "Headaches",
    "Shortness of breath",
    "Nosebleeds",
    "Chest pain",
    "Dizziness"
  ]'::jsonb,
  '[
    "High sodium intake",
    "Obesity",
    "Stress",
    "Family history",
    "Age"
  ]'::jsonb,
  '[
    {
      "remedy": "Garlic",
      "instructions": "Consume 2-3 cloves of raw garlic daily",
      "frequency": "Daily"
    },
    {
      "remedy": "Hibiscus tea",
      "instructions": "Steep hibiscus flowers in hot water for 5 minutes",
      "frequency": "2 times daily"
    },
    {
      "remedy": "Meditation",
      "instructions": "Practice deep breathing exercises",
      "frequency": "15 minutes daily"
    }
  ]'::jsonb,
  '[
    "Reduce salt intake",
    "Regular exercise",
    "Stress management",
    "Limit alcohol",
    "Quit smoking"
  ]'::jsonb,
  'High'
);

-- Insert sample live location data
INSERT INTO live_location_data (
  location, 
  air_quality_index, 
  pollution_level, 
  temperature, 
  humidity, 
  wind_speed, 
  rainfall, 
  uv_index, 
  pollen_count
) 
VALUES 
('Mumbai', 156, 75, 32, 78, 12, 0, 8, 120),
('Chennai', 132, 65, 34, 72, 15, 0, 9, 85),
('Kolkata', 168, 82, 31, 85, 8, 2, 7, 95),
('Delhi', 195, 89, 36, 45, 10, 0, 8, 150),
('Bangalore', 98, 45, 28, 65, 18, 1, 6, 70)
ON CONFLICT (location) 
DO UPDATE SET 
  air_quality_index = EXCLUDED.air_quality_index,
  pollution_level = EXCLUDED.pollution_level,
  temperature = EXCLUDED.temperature,
  humidity = EXCLUDED.humidity,
  wind_speed = EXCLUDED.wind_speed,
  rainfall = EXCLUDED.rainfall,
  uv_index = EXCLUDED.uv_index,
  pollen_count = EXCLUDED.pollen_count,
  updated_at = now();

-- Insert sample doctor availability
INSERT INTO doctor_availability (
  doctor_id,
  day_of_week,
  start_time,
  end_time,
  max_appointments,
  location,
  consultation_fee
)
SELECT 
  id as doctor_id,
  unnest(ARRAY['Monday', 'Wednesday', 'Friday']) as day_of_week,
  '09:00'::time as start_time,
  '17:00'::time as end_time,
  8 as max_appointments,
  location,
  2500 as consultation_fee
FROM specialists
ON CONFLICT (doctor_id, day_of_week)
DO NOTHING;