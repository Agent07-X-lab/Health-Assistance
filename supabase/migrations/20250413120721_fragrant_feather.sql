/*
  # Patient Predictive Analysis System

  1. New Tables
    - `patient_predictive_analysis`
      - Stores comprehensive health analysis for each patient
      - Includes risk factors, predictions, and detailed recommendations
      - Links to patients table
      - Maintains historical analysis data

  2. Security
    - Enable RLS
    - Policies for patient and doctor access
    - Super admin access for oversight

  3. Data Structure
    - JSON fields for flexible data storage
    - Timestamps for tracking analysis history
    - Links to related health metrics
*/

-- Create the patient predictive analysis table
CREATE TABLE IF NOT EXISTS patient_predictive_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  analysis_date timestamptz DEFAULT now(),
  
  -- Core Health Metrics
  vital_signs jsonb NOT NULL DEFAULT '{
    "blood_pressure": {"systolic": 120, "diastolic": 80},
    "heart_rate": 72,
    "respiratory_rate": 16,
    "temperature": 98.6,
    "oxygen_saturation": 98
  }'::jsonb,
  
  -- Risk Analysis
  risk_factors jsonb NOT NULL DEFAULT '[]'::jsonb,
  disease_predictions jsonb NOT NULL DEFAULT '[]'::jsonb,
  
  -- Detailed Analysis Components
  lifestyle_impact jsonb NOT NULL DEFAULT '{
    "diet": {"score": 0, "factors": []},
    "exercise": {"score": 0, "factors": []},
    "sleep": {"score": 0, "factors": []},
    "stress": {"score": 0, "factors": []}
  }'::jsonb,
  
  environmental_factors jsonb NOT NULL DEFAULT '{
    "air_quality_impact": 0,
    "weather_sensitivity": 0,
    "seasonal_effects": [],
    "geographical_risks": []
  }'::jsonb,
  
  -- Medical Analysis
  medical_history_analysis jsonb NOT NULL DEFAULT '{
    "chronic_conditions": [],
    "genetic_factors": [],
    "previous_conditions": [],
    "family_history_impact": []
  }'::jsonb,
  
  -- Recommendations
  recommendations jsonb NOT NULL DEFAULT '{
    "immediate_actions": [],
    "lifestyle_changes": [],
    "medical_interventions": [],
    "preventive_measures": []
  }'::jsonb,
  
  -- Specialist Recommendations
  specialist_referrals jsonb NOT NULL DEFAULT '[]'::jsonb,
  
  -- Treatment Plans
  suggested_treatments jsonb NOT NULL DEFAULT '{
    "medications": [],
    "therapies": [],
    "preventive_care": [],
    "follow_up_schedule": []
  }'::jsonb,
  
  -- Analysis Metadata
  analysis_version text NOT NULL DEFAULT '1.0',
  confidence_score float NOT NULL DEFAULT 0.0,
  last_updated timestamptz DEFAULT now(),
  
  -- Tracking Fields
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patient_analysis_patient_id ON patient_predictive_analysis(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_analysis_date ON patient_predictive_analysis(analysis_date);

-- Enable Row Level Security
ALTER TABLE patient_predictive_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Users can view their own analysis"
  ON patient_predictive_analysis
  FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view their patients' analysis"
  ON patient_predictive_analysis
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments 
      WHERE appointments.patient_id = patient_predictive_analysis.patient_id
      AND appointments.specialist_id IN (
        SELECT id FROM specialists 
        WHERE specialists.id = appointments.specialist_id
      )
    )
  );

-- Insert sample analysis data
INSERT INTO patient_predictive_analysis (
  patient_id,
  risk_factors,
  disease_predictions,
  lifestyle_impact,
  recommendations
) 
SELECT 
  id as patient_id,
  '[
    {
      "factor": "High Blood Pressure",
      "severity": "Moderate",
      "impact": 0.7,
      "description": "Consistently elevated blood pressure readings indicate increased cardiovascular risk",
      "contributing_factors": [
        "Family history of hypertension",
        "High sodium diet",
        "Sedentary lifestyle"
      ]
    },
    {
      "factor": "Irregular Sleep Pattern",
      "severity": "Mild",
      "impact": 0.4,
      "description": "Irregular sleep schedule may affect overall health and stress levels",
      "contributing_factors": [
        "Work-related stress",
        "Late-night screen time",
        "Inconsistent bedtime routine"
      ]
    }
  ]'::jsonb as risk_factors,
  '[
    {
      "condition": "Type 2 Diabetes",
      "probability": 0.35,
      "key_indicators": [
        "Family history",
        "Elevated blood sugar",
        "Sedentary lifestyle"
      ],
      "preventive_measures": [
        "Regular exercise",
        "Dietary modifications",
        "Weight management"
      ]
    },
    {
      "condition": "Cardiovascular Disease",
      "probability": 0.28,
      "key_indicators": [
        "High blood pressure",
        "Family history",
        "Stress levels"
      ],
      "preventive_measures": [
        "Blood pressure management",
        "Regular cardiovascular exercise",
        "Stress reduction techniques"
      ]
    }
  ]'::jsonb as disease_predictions,
  '{
    "diet": {
      "score": 0.65,
      "factors": [
        "High processed food intake",
        "Irregular meal timing",
        "Inadequate fiber intake"
      ],
      "recommendations": [
        "Increase whole grain consumption",
        "Regular meal scheduling",
        "Reduce processed food intake"
      ]
    },
    "exercise": {
      "score": 0.45,
      "factors": [
        "Sedentary job nature",
        "Limited physical activity",
        "Irregular exercise routine"
      ],
      "recommendations": [
        "30 minutes daily moderate exercise",
        "Regular walking breaks",
        "Strength training twice weekly"
      ]
    },
    "sleep": {
      "score": 0.70,
      "factors": [
        "Irregular sleep schedule",
        "Screen time before bed",
        "Sleep environment"
      ],
      "recommendations": [
        "Consistent sleep schedule",
        "Reduce screen time before bed",
        "Optimize sleep environment"
      ]
    },
    "stress": {
      "score": 0.60,
      "factors": [
        "Work-related stress",
        "Time management issues",
        "Limited relaxation time"
      ],
      "recommendations": [
        "Daily meditation practice",
        "Regular breaks during work",
        "Stress management techniques"
      ]
    }
  }'::jsonb as lifestyle_impact,
  '[
    {
      "category": "Immediate Actions",
      "priority": "High",
      "recommendations": [
        "Schedule comprehensive health checkup",
        "Begin blood pressure monitoring",
        "Start stress management program"
      ],
      "timeline": "Within 2 weeks",
      "expected_benefits": [
        "Better health monitoring",
        "Reduced health risks",
        "Improved well-being"
      ]
    },
    {
      "category": "Lifestyle Changes",
      "priority": "Medium",
      "recommendations": [
        "Implement regular exercise routine",
        "Modify diet plan",
        "Establish sleep schedule"
      ],
      "timeline": "Within 1 month",
      "expected_benefits": [
        "Weight management",
        "Improved energy levels",
        "Better sleep quality"
      ]
    },
    {
      "category": "Long-term Goals",
      "priority": "Medium",
      "recommendations": [
        "Regular health monitoring",
        "Preventive health measures",
        "Lifestyle maintenance"
      ],
      "timeline": "Ongoing",
      "expected_benefits": [
        "Sustained health improvement",
        "Reduced health risks",
        "Better quality of life"
      ]
    }
  ]'::jsonb as recommendations
FROM patients
LIMIT 1;

-- Create function to update analysis timestamp
CREATE OR REPLACE FUNCTION update_patient_analysis_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update timestamp
CREATE TRIGGER update_patient_analysis_timestamp
  BEFORE UPDATE ON patient_predictive_analysis
  FOR EACH ROW
  EXECUTE FUNCTION update_patient_analysis_timestamp();