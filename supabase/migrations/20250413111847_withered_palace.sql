/*
  # Create Disease Predictions Table

  1. New Tables
    - `disease_predictions`
      - `id` (uuid, primary key)
      - `disease_name` (text)
      - `symptoms` (text[])
      - `remedies` (jsonb)
      - `medications` (jsonb)
      - `tests` (jsonb)
      - `environmental_factors` (jsonb)
      - `recommended_specialists` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policy for authenticated users to read predictions
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS disease_predictions;

-- Create the disease predictions table
CREATE TABLE disease_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  disease_name text NOT NULL,
  symptoms text[] NOT NULL,
  remedies jsonb NOT NULL,
  medications jsonb NOT NULL,
  tests jsonb NOT NULL,
  environmental_factors jsonb DEFAULT '[]'::jsonb,
  recommended_specialists jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE disease_predictions ENABLE ROW LEVEL SECURITY;

-- Create the access policy
CREATE POLICY "Anyone can view disease predictions"
  ON disease_predictions
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample prediction data
INSERT INTO disease_predictions (
  disease_name,
  symptoms,
  remedies,
  medications,
  tests,
  environmental_factors,
  recommended_specialists
) VALUES (
  'Hypertension',
  ARRAY['High blood pressure', 'Headache', 'Dizziness'],
  '[
    {
      "type": "Lifestyle Changes",
      "description": "Dietary and exercise modifications",
      "instructions": "Reduce salt intake, regular exercise",
      "duration": "Ongoing",
      "effectiveness": 0.8
    },
    {
      "type": "Stress Management",
      "description": "Meditation and relaxation techniques",
      "instructions": "Practice daily meditation for 15-20 minutes",
      "duration": "Ongoing",
      "effectiveness": 0.7
    }
  ]'::jsonb,
  '[
    {
      "name": "Amlodipine",
      "dosage": "5mg",
      "frequency": "Once daily",
      "duration": "3 months",
      "cost": 500,
      "side_effects": ["Swelling", "Dizziness"]
    },
    {
      "name": "Lisinopril",
      "dosage": "10mg",
      "frequency": "Once daily",
      "duration": "3 months",
      "cost": 600,
      "side_effects": ["Dry cough", "Headache"]
    }
  ]'::jsonb,
  '[
    {
      "name": "24-Hour Blood Pressure Monitoring",
      "purpose": "Monitor blood pressure variations",
      "cost": 2000,
      "preparation": "Wear the monitor for 24 hours",
      "duration": "24 hours"
    },
    {
      "name": "Echocardiogram",
      "purpose": "Check heart function",
      "cost": 3500,
      "preparation": "No special preparation needed",
      "duration": "30 minutes"
    }
  ]'::jsonb,
  '[
    {
      "factor": "Air Quality",
      "impact": "High",
      "recommendation": "Avoid outdoor activities during high pollution"
    },
    {
      "factor": "Temperature",
      "impact": "Moderate",
      "recommendation": "Maintain consistent indoor temperature"
    }
  ]'::jsonb,
  '[
    {
      "specialization": "Cardiologist",
      "reason": "Primary care for hypertension",
      "priority": "High"
    },
    {
      "specialization": "Nutritionist",
      "reason": "Diet management",
      "priority": "Medium"
    }
  ]'::jsonb
);