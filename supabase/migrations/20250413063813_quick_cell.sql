/*
  # Add Test Users and Sample Data

  1. New Users
    - User 1: Aditya161499@gmail.com
    - User 2: Manishkumar@gmail.com

  2. Security
    - Passwords are hashed using bcrypt
    - Email confirmation is set to true
    - Users are given full access through RLS policies

  3. Sample Data
    - Environmental data for major cities
    - Patient records for each user
*/

-- First, create the test users with fixed UUIDs
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  email,
  crypt(password, gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
FROM (
  VALUES 
    ('Aditya161499@gmail.com', 'Aditya14?'),
    ('Manishkumar@gmail.com', 'Manish@123')
) AS users(email, password)
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE users.email = auth.users.email
);

-- Insert sample environmental data if not exists
INSERT INTO environmental_data (location, air_quality, water_quality, pollution_level)
SELECT * FROM (
  VALUES 
    ('Mumbai', 85, 75, 82),
    ('Chennai', 78, 82, 75),
    ('Kolkata', 92, 70, 88)
) AS data(location, air_quality, water_quality, pollution_level)
WHERE NOT EXISTS (
  SELECT 1 FROM environmental_data WHERE location = data.location
);

-- Insert sample patients for the new users
DO $$
DECLARE
  aditya_id uuid;
  manish_id uuid;
  locations text[] := ARRAY['Mumbai', 'Chennai', 'Kolkata'];
  conditions text[] := ARRAY['Respiratory Issues', 'Cardiovascular Disease', 'Diabetes', 'Hypertension', 'Asthma'];
  chronic_conditions text[][] := ARRAY[
    ARRAY['Asthma', 'Allergies'],
    ARRAY['Diabetes', 'Hypertension'],
    ARRAY['COPD', 'Bronchitis'],
    ARRAY['Heart Disease', 'High Cholesterol']
  ];
  medications text[][] := ARRAY[
    ARRAY['Albuterol', 'Fluticasone'],
    ARRAY['Metformin', 'Lisinopril'],
    ARRAY['Ventolin', 'Antibiotics'],
    ARRAY['Statins', 'Beta Blockers']
  ];
BEGIN
  -- Get user IDs
  SELECT id INTO aditya_id FROM auth.users WHERE email = 'Aditya161499@gmail.com' LIMIT 1;
  SELECT id INTO manish_id FROM auth.users WHERE email = 'Manishkumar@gmail.com' LIMIT 1;

  -- Only proceed if we found both users
  IF aditya_id IS NOT NULL AND manish_id IS NOT NULL THEN
    -- Add sample patients for each user
    FOR i IN 1..100 LOOP
      -- For Aditya
      INSERT INTO patients (
        name,
        age,
        location,
        condition,
        last_visit,
        medical_history,
        user_id
      ) VALUES (
        'Patient A' || i,
        20 + floor(random() * 60)::integer,
        locations[1 + floor(random() * array_length(locations, 1))],
        conditions[1 + floor(random() * array_length(conditions, 1))],
        current_date - (floor(random() * 30)::integer || ' days')::interval,
        jsonb_build_object(
          'chronic_conditions', chronic_conditions[1 + floor(random() * array_length(chronic_conditions, 1))],
          'past_medications', medications[1 + floor(random() * array_length(medications, 1))]
        ),
        aditya_id
      );

      -- For Manish
      INSERT INTO patients (
        name,
        age,
        location,
        condition,
        last_visit,
        medical_history,
        user_id
      ) VALUES (
        'Patient M' || i,
        20 + floor(random() * 60)::integer,
        locations[1 + floor(random() * array_length(locations, 1))],
        conditions[1 + floor(random() * array_length(conditions, 1))],
        current_date - (floor(random() * 30)::integer || ' days')::interval,
        jsonb_build_object(
          'chronic_conditions', chronic_conditions[1 + floor(random() * array_length(chronic_conditions, 1))],
          'past_medications', medications[1 + floor(random() * array_length(medications, 1))]
        ),
        manish_id
      );
    END LOOP;
  END IF;
END $$;