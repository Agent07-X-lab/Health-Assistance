/*
  # Fix Patient Data and RLS Policies

  1. Changes
    - Add proper RLS policies for patients table
    - Add sample patients with correct user_id
    - Add environmental and specialist data
*/

-- Enable RLS on patients table if not already enabled
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own patients" ON patients;
DROP POLICY IF EXISTS "Users can insert their own patients" ON patients;
DROP POLICY IF EXISTS "Users can update their own patients" ON patients;
DROP POLICY IF EXISTS "Super admin can view all patients" ON patients;
DROP POLICY IF EXISTS "Super admin can update all patients" ON patients;
DROP POLICY IF EXISTS "Super admin can delete patients" ON patients;

-- Create RLS policies
CREATE POLICY "Users can view their own patients" 
ON patients FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patients" 
ON patients FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patients" 
ON patients FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Super admin can view all patients" 
ON patients FOR SELECT 
TO authenticated 
USING ((auth.jwt() ->> 'role'::text) = 'super_admin'::text);

CREATE POLICY "Super admin can update all patients" 
ON patients FOR UPDATE 
TO authenticated 
USING ((auth.jwt() ->> 'role'::text) = 'super_admin'::text);

CREATE POLICY "Super admin can delete patients" 
ON patients FOR DELETE 
TO authenticated 
USING ((auth.jwt() ->> 'role'::text) = 'super_admin'::text);

-- Add sample specialists if not exists
INSERT INTO specialists (name, specialization, hospital_name, location, contact_number, email, availability, experience_years)
SELECT * FROM (VALUES
  ('Dr. Priya Sharma', 'Cardiologist', 'Apollo Hospital', 'Mumbai', '+91-9876543210', 'priya.sharma@apollo.com', 'Mon-Fri, 9AM-5PM', 15),
  ('Dr. Rajesh Kumar', 'Pulmonologist', 'Fortis Hospital', 'Mumbai', '+91-9876543211', 'rajesh.kumar@fortis.com', 'Mon-Sat, 10AM-6PM', 12),
  ('Dr. Anita Desai', 'Endocrinologist', 'Lilavati Hospital', 'Mumbai', '+91-9876543212', 'anita.desai@lilavati.com', 'Tue-Sat, 9AM-4PM', 18),
  ('Dr. Suresh Menon', 'Cardiologist', 'Apollo Hospital', 'Chennai', '+91-9876543213', 'suresh.menon@apollo.com', 'Mon-Fri, 9AM-5PM', 20),
  ('Dr. Lakshmi Rajan', 'Pulmonologist', 'Global Hospital', 'Chennai', '+91-9876543214', 'lakshmi.rajan@global.com', 'Mon-Sat, 8AM-4PM', 14),
  ('Dr. Ramesh Iyer', 'Endocrinologist', 'Fortis Malar', 'Chennai', '+91-9876543215', 'ramesh.iyer@fortis.com', 'Wed-Sun, 10AM-6PM', 16),
  ('Dr. Amit Sen', 'Cardiologist', 'AMRI Hospital', 'Kolkata', '+91-9876543216', 'amit.sen@amri.com', 'Mon-Fri, 9AM-5PM', 17),
  ('Dr. Sanjay Ghosh', 'Pulmonologist', 'Apollo Gleneagles', 'Kolkata', '+91-9876543217', 'sanjay.ghosh@apollo.com', 'Tue-Sat, 10AM-6PM', 13),
  ('Dr. Meera Das', 'Endocrinologist', 'Fortis Hospital', 'Kolkata', '+91-9876543218', 'meera.das@fortis.com', 'Mon-Fri, 8AM-4PM', 19)
) AS new_specialists
WHERE NOT EXISTS (
  SELECT 1 FROM specialists WHERE email = new_specialists.column5
);

-- Add environmental data if not exists
INSERT INTO environmental_data (location, air_quality, water_quality, pollution_level)
SELECT * FROM (VALUES
  ('Mumbai', 65, 75, 70),
  ('Chennai', 70, 80, 60),
  ('Kolkata', 60, 70, 75)
) AS new_env_data
WHERE NOT EXISTS (
  SELECT 1 FROM environmental_data WHERE location = new_env_data.column1
);

-- Add sample patients
DO $$
DECLARE
  user_id uuid;
  locations text[] := ARRAY['Mumbai', 'Chennai', 'Kolkata'];
  conditions text[] := ARRAY['Hypertension', 'Diabetes', 'Respiratory Issues', 'Cardiovascular Disease'];
  names text[] := ARRAY[
    'Rahul Mehta', 'Priya Patel', 'Amit Shah', 'Neha Singh', 'Raj Kumar',
    'Anjali Desai', 'Vikram Malhotra', 'Pooja Sharma', 'Sanjay Verma', 'Meera Reddy'
  ];
BEGIN
  -- Get the user ID for as4008@srmist.edu.in
  SELECT id INTO user_id FROM auth.users WHERE email = 'as4008@srmist.edu.in';

  -- Only proceed if we found the user
  IF user_id IS NOT NULL THEN
    -- Delete existing patients for this user
    DELETE FROM patients WHERE user_id = user_id;

    -- Insert new sample patients
    FOR i IN 1..10 LOOP
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
      )
      VALUES (
        names[1 + (i % 10)],
        25 + (i * 2),
        locations[1 + (i % 3)],
        conditions[1 + (i % 4)],
        CURRENT_DATE - (i || ' days')::interval,
        CASE locations[1 + (i % 3)]
          WHEN 'Mumbai' THEN 'Apollo Hospital'
          WHEN 'Chennai' THEN 'Fortis Hospital'
          ELSE 'AMRI Hospital'
        END,
        CASE conditions[1 + (i % 4)]
          WHEN 'Hypertension' THEN '{
            "blood_pressure": {"systolic": 145, "diastolic": 95},
            "blood_sugar": {"fasting": 100, "post_prandial": 145},
            "oxygen_saturation": 97,
            "heart_rate": 78,
            "temperature": 98.6,
            "respiratory_rate": 18
          }'::jsonb
          WHEN 'Diabetes' THEN '{
            "blood_pressure": {"systolic": 130, "diastolic": 85},
            "blood_sugar": {"fasting": 130, "post_prandial": 180},
            "oxygen_saturation": 98,
            "heart_rate": 76,
            "temperature": 98.6,
            "respiratory_rate": 16
          }'::jsonb
          ELSE '{
            "blood_pressure": {"systolic": 120, "diastolic": 80},
            "blood_sugar": {"fasting": 95, "post_prandial": 140},
            "oxygen_saturation": 98,
            "heart_rate": 72,
            "temperature": 98.6,
            "respiratory_rate": 16
          }'::jsonb
        END,
        '{
          "chronic_conditions": ["Hypertension", "High Cholesterol"],
          "past_medications": ["Amlodipine", "Metformin"],
          "allergies": ["Penicillin"],
          "blood_type": "O+",
          "family_history": ["Diabetes", "Heart Disease"]
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
          "marital_status": "Single",
          "locality": "Urban",
          "socioeconomic_status": "Middle Class"
        }'::jsonb,
        user_id
      );
    END LOOP;
  END IF;
END $$;