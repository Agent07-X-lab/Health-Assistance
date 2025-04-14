/*
  # Enhanced Patient Data with Specialists and Demographics

  1. New Tables
    - specialists: Information about medical specialists
    - diet_recommendations: Dietary guidelines based on conditions
    - patient_predictions: ML model predictions for patients

  2. Enhanced Data
    - More detailed patient demographics
    - Specialist recommendations
    - Environmental impact factors
*/

-- Create specialists table
CREATE TABLE IF NOT EXISTS specialists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL,
  hospital_name text NOT NULL,
  location text NOT NULL,
  contact_number text NOT NULL,
  email text NOT NULL,
  availability text NOT NULL,
  experience_years integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for specialists
ALTER TABLE specialists ENABLE ROW LEVEL SECURITY;

-- Create policy for specialists table
CREATE POLICY "Anyone can view specialists"
  ON specialists
  FOR SELECT
  TO authenticated
  USING (true);

-- Create diet recommendations table
CREATE TABLE IF NOT EXISTS diet_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  condition text NOT NULL,
  recommendations jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for diet_recommendations
ALTER TABLE diet_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policy for diet_recommendations table
CREATE POLICY "Anyone can view diet recommendations"
  ON diet_recommendations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create patient predictions table
CREATE TABLE IF NOT EXISTS patient_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id),
  predictions jsonb NOT NULL,
  environmental_factors jsonb NOT NULL,
  recommended_specialists jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for patient_predictions
ALTER TABLE patient_predictions ENABLE ROW LEVEL SECURITY;

-- Create policy for patient_predictions table
CREATE POLICY "Users can view their patients' predictions"
  ON patient_predictions
  FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

-- Insert sample specialists data
INSERT INTO specialists (name, specialization, hospital_name, location, contact_number, email, availability, experience_years) VALUES
  ('Dr. Rajesh Kumar', 'Cardiologist', 'Apollo Hospital', 'Mumbai', '+91-9876543210', 'rajesh.kumar@apollo.com', 'Mon-Fri, 9AM-5PM', 15),
  ('Dr. Priya Sharma', 'Pulmonologist', 'Fortis Healthcare', 'Mumbai', '+91-9876543211', 'priya.sharma@fortis.com', 'Mon-Sat, 10AM-6PM', 12),
  ('Dr. Amit Patel', 'Endocrinologist', 'Max Hospital', 'Chennai', '+91-9876543212', 'amit.patel@max.com', 'Mon-Fri, 8AM-4PM', 10),
  ('Dr. Sneha Reddy', 'Neurologist', 'Apollo Hospital', 'Chennai', '+91-9876543213', 'sneha.reddy@apollo.com', 'Tue-Sat, 9AM-5PM', 14),
  ('Dr. Arun Singh', 'Oncologist', 'Medanta Hospital', 'Kolkata', '+91-9876543214', 'arun.singh@medanta.com', 'Mon-Fri, 9AM-5PM', 18),
  ('Dr. Meera Gupta', 'Rheumatologist', 'Narayana Health', 'Kolkata', '+91-9876543215', 'meera.gupta@narayana.com', 'Mon-Sat, 10AM-6PM', 13);

-- Insert sample diet recommendations
INSERT INTO diet_recommendations (condition, recommendations) VALUES
  ('Diabetes', '{
    "avoid": ["Sugary drinks", "White bread", "Processed snacks"],
    "recommended": ["Whole grains", "Leafy greens", "Lean proteins"],
    "meal_timing": "Every 2-3 hours",
    "special_instructions": "Monitor carbohydrate intake"
  }'::jsonb),
  ('Hypertension', '{
    "avoid": ["Excess salt", "Processed foods", "Alcohol"],
    "recommended": ["Fresh fruits", "Vegetables", "Low-fat dairy"],
    "meal_timing": "Regular intervals",
    "special_instructions": "Follow DASH diet principles"
  }'::jsonb),
  ('Respiratory Issues', '{
    "avoid": ["Spicy foods", "Cold drinks", "Heavy meals"],
    "recommended": ["Warm soups", "Ginger tea", "Steam-cooked vegetables"],
    "meal_timing": "Small frequent meals",
    "special_instructions": "Stay hydrated"
  }'::jsonb);

-- Update patients table with more detailed information
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS diet_type text,
ADD COLUMN IF NOT EXISTS lifestyle_factors jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS demographic_info jsonb DEFAULT '{}'::jsonb;

-- Create demographic data arrays
DO $$
DECLARE
  indian_names text[] := ARRAY[
    'Aarav', 'Advait', 'Arjun', 'Dhruv', 'Ishaan', 'Krishna', 'Vihaan',
    'Aanya', 'Diya', 'Ishita', 'Kavya', 'Mira', 'Priya', 'Zara',
    'Kabir', 'Rohan', 'Vivaan', 'Aisha', 'Ananya', 'Riya', 'Saanvi',
    'Dev', 'Neil', 'Reyansh', 'Aadhya', 'Avni', 'Kiara', 'Myra',
    'Aryan', 'Ayaan', 'Virat', 'Aditi', 'Avani', 'Kyra', 'Siya'
  ];
  surnames text[] := ARRAY[
    'Patel', 'Kumar', 'Singh', 'Shah', 'Sharma', 'Verma', 'Gupta',
    'Malhotra', 'Kapoor', 'Joshi', 'Chopra', 'Mehta', 'Reddy', 'Nair',
    'Iyer', 'Rao', 'Das', 'Chatterjee', 'Banerjee', 'Mukherjee'
  ];
  diet_types text[] := ARRAY['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Pescatarian'];
  occupations text[] := ARRAY['Software Engineer', 'Teacher', 'Doctor', 'Business Owner', 'Student', 'Retired', 'Homemaker'];
  localities text[] := ARRAY[
    'Andheri', 'Bandra', 'Colaba', 'Dadar', 'Powai',  -- Mumbai
    'Adyar', 'Anna Nagar', 'T Nagar', 'Mylapore', 'Velachery',  -- Chennai
    'Salt Lake', 'Park Street', 'Ballygunge', 'Alipore', 'Howrah'  -- Kolkata
  ];
  i integer;
  chosen_name text;
  chosen_surname text;
  chosen_location text;
  chosen_locality text;
  lifestyle_data jsonb;
  demographic_data jsonb;
BEGIN
  -- Update existing patients with enhanced data
  FOR i IN 1..250 LOOP
    -- Select random name components
    chosen_name := indian_names[1 + floor(random() * array_length(indian_names, 1))];
    chosen_surname := surnames[1 + floor(random() * array_length(surnames, 1))];
    
    -- Match locality to city
    chosen_location := (
      SELECT location 
      FROM patients 
      WHERE name LIKE 'Patient ' || i || '%'
      LIMIT 1
    );
    
    -- Select appropriate locality based on city
    chosen_locality := CASE chosen_location
      WHEN 'Mumbai' THEN localities[1 + floor(random() * 5)]
      WHEN 'Chennai' THEN localities[6 + floor(random() * 5)]
      WHEN 'Kolkata' THEN localities[11 + floor(random() * 5)]
      ELSE localities[1 + floor(random() * array_length(localities, 1))]
    END;

    -- Generate lifestyle data
    lifestyle_data := jsonb_build_object(
      'exercise_frequency', (1 + floor(random() * 7))::text || ' days per week',
      'sleep_hours', (6 + floor(random() * 4))::text || ' hours',
      'stress_level', (ARRAY['Low', 'Medium', 'High'])[1 + floor(random() * 3)],
      'smoking_status', (ARRAY['Non-smoker', 'Former smoker', 'Current smoker'])[1 + floor(random() * 3)],
      'alcohol_consumption', (ARRAY['None', 'Occasional', 'Regular'])[1 + floor(random() * 3)]
    );

    -- Generate demographic data
    demographic_data := jsonb_build_object(
      'occupation', occupations[1 + floor(random() * array_length(occupations, 1))],
      'education_level', (ARRAY['High School', 'Bachelor''s', 'Master''s', 'PhD'])[1 + floor(random() * 4)],
      'marital_status', (ARRAY['Single', 'Married', 'Divorced', 'Widowed'])[1 + floor(random() * 4)],
      'locality', chosen_locality,
      'socioeconomic_status', (ARRAY['Lower', 'Middle', 'Upper Middle', 'Upper'])[1 + floor(random() * 4)]
    );

    -- Update patient record
    UPDATE patients 
    SET 
      name = chosen_name || ' ' || chosen_surname,
      diet_type = diet_types[1 + floor(random() * array_length(diet_types, 1))],
      lifestyle_factors = lifestyle_data,
      demographic_info = demographic_data
    WHERE name LIKE 'Patient ' || i || '%';
  END LOOP;
END $$;