/*
  # Add test patients data

  1. Changes
    - Add sample patients for testing
    - Associate patients with the current user's ID
    
  2. Security
    - Maintains existing RLS policies
    - Only adds data, no policy changes
*/

-- Function to add sample patients
CREATE OR REPLACE FUNCTION add_sample_patients()
RETURNS void AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current user's ID
  current_user_id := auth.uid();
  
  -- Only proceed if we have a user ID
  IF current_user_id IS NOT NULL THEN
    -- Insert sample patients
    INSERT INTO patients (
      name,
      age,
      location,
      condition,
      last_visit,
      hospital_name,
      vital_signs,
      medical_history,
      lifestyle_factors,
      demographic_info,
      user_id
    ) VALUES 
    (
      'John Smith',
      45,
      'Mumbai',
      'Hypertension',
      CURRENT_DATE - INTERVAL '2 days',
      'Apollo Hospital',
      '{
        "blood_pressure": {"systolic": 140, "diastolic": 90},
        "blood_sugar": {"fasting": 100, "post_prandial": 140},
        "oxygen_saturation": 98,
        "heart_rate": 72,
        "temperature": 98.6,
        "respiratory_rate": 16
      }'::jsonb,
      '{
        "chronic_conditions": ["Hypertension"],
        "past_medications": ["Amlodipine"],
        "allergies": ["Penicillin"],
        "blood_type": "O+",
        "family_history": ["Heart Disease"]
      }'::jsonb,
      '{
        "exercise_frequency": "3 times per week",
        "sleep_hours": "7",
        "stress_level": "Medium",
        "smoking_status": "Non-smoker",
        "alcohol_consumption": "Occasional"
      }'::jsonb,
      '{
        "occupation": "Software Engineer",
        "education_level": "Graduate",
        "marital_status": "Married",
        "locality": "Urban",
        "socioeconomic_status": "Middle Class"
      }'::jsonb,
      current_user_id
    ),
    (
      'Mary Johnson',
      35,
      'Chennai',
      'Diabetes',
      CURRENT_DATE - INTERVAL '5 days',
      'Fortis Hospital',
      '{
        "blood_pressure": {"systolic": 120, "diastolic": 80},
        "blood_sugar": {"fasting": 130, "post_prandial": 180},
        "oxygen_saturation": 99,
        "heart_rate": 68,
        "temperature": 98.4,
        "respiratory_rate": 14
      }'::jsonb,
      '{
        "chronic_conditions": ["Type 2 Diabetes"],
        "past_medications": ["Metformin"],
        "allergies": [],
        "blood_type": "A+",
        "family_history": ["Diabetes"]
      }'::jsonb,
      '{
        "exercise_frequency": "4 times per week",
        "sleep_hours": "8",
        "stress_level": "Low",
        "smoking_status": "Non-smoker",
        "alcohol_consumption": "None"
      }'::jsonb,
      '{
        "occupation": "Teacher",
        "education_level": "Post Graduate",
        "marital_status": "Single",
        "locality": "Suburban",
        "socioeconomic_status": "Middle Class"
      }'::jsonb,
      current_user_id
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT add_sample_patients();