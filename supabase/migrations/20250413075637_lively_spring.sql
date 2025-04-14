/*
  # Add 250 sample patients

  1. Changes
    - Add 250 diverse patient records
    - Associate all patients with the specified user (as4008)
    - Include varied medical conditions, locations, and vital signs
    
  2. Security
    - Maintains existing RLS policies
    - Only adds data, no policy changes
*/

DO $$
DECLARE
  v_user_id uuid;
  locations text[] := ARRAY['Mumbai', 'Chennai', 'Kolkata', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];
  conditions text[] := ARRAY[
    'Hypertension', 'Diabetes Type 2', 'Asthma', 'Cardiovascular Disease', 
    'Arthritis', 'COPD', 'Obesity', 'Thyroid Disorder', 'Anxiety', 'Depression',
    'Migraine', 'Gastritis', 'Lower Back Pain', 'Allergic Rhinitis', 'Insomnia'
  ];
  hospitals text[] := ARRAY[
    'Apollo Hospital', 'Fortis Hospital', 'Max Healthcare', 'Medanta Hospital',
    'Manipal Hospital', 'AIIMS', 'Narayana Health', 'Columbia Asia', 'Artemis Hospital',
    'Kokilaben Hospital', 'Hinduja Hospital', 'Lilavati Hospital', 'Tata Memorial'
  ];
  first_names text[] := ARRAY[
    'Aarav', 'Aditi', 'Arjun', 'Ananya', 'Dhruv', 'Diya', 'Ishaan', 'Isha',
    'Kabir', 'Kiara', 'Vihaan', 'Zara', 'Rehan', 'Riya', 'Vivaan', 'Anaya',
    'Neil', 'Myra', 'Aditya', 'Avni', 'Rohan', 'Aisha', 'Aryan', 'Ziva'
  ];
  last_names text[] := ARRAY[
    'Patel', 'Sharma', 'Kumar', 'Singh', 'Mehta', 'Shah', 'Verma', 'Reddy',
    'Malhotra', 'Kapoor', 'Gupta', 'Joshi', 'Chopra', 'Desai', 'Iyer', 'Rao',
    'Nair', 'Menon', 'Pillai', 'Bhat', 'Hegde', 'Shetty', 'Das', 'Banerjee'
  ];
  blood_types text[] := ARRAY['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  occupations text[] := ARRAY[
    'Software Engineer', 'Doctor', 'Teacher', 'Business Analyst', 'Accountant',
    'Architect', 'Lawyer', 'Sales Manager', 'Chef', 'Artist', 'Journalist',
    'Professor', 'Entrepreneur', 'Consultant', 'Bank Manager'
  ];
  education_levels text[] := ARRAY[
    'High School', 'Bachelor''s Degree', 'Master''s Degree', 'Ph.D.',
    'Diploma', 'Professional Certification', 'Post Graduate'
  ];
  marital_statuses text[] := ARRAY['Single', 'Married', 'Divorced', 'Widowed'];
  localities text[] := ARRAY['Urban', 'Suburban', 'Rural'];
  socioeconomic_statuses text[] := ARRAY['Lower Middle Class', 'Middle Class', 'Upper Middle Class', 'High Income'];
  exercise_frequencies text[] := ARRAY[
    'Daily', '3-4 times per week', '1-2 times per week', 'Occasionally', 'Rarely'
  ];
  sleep_hours text[] := ARRAY['5', '6', '7', '8', '9'];
  stress_levels text[] := ARRAY['Low', 'Medium', 'High'];
  smoking_statuses text[] := ARRAY['Non-smoker', 'Former smoker', 'Occasional smoker', 'Regular smoker'];
  alcohol_consumption text[] := ARRAY['None', 'Occasional', 'Regular', 'Former drinker'];
BEGIN
  -- Get the user ID for as4008@srmist.edu.in
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'as4008@srmist.edu.in';

  -- Only proceed if we found the user
  IF v_user_id IS NOT NULL THEN
    -- Delete existing patients for this user
    DELETE FROM patients WHERE user_id = v_user_id;

    -- Insert 250 diverse patients
    FOR i IN 1..250 LOOP
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
        -- Generate full name
        first_names[1 + (i % array_length(first_names, 1))] || ' ' ||
        last_names[1 + (i % array_length(last_names, 1))],
        
        -- Age between 18 and 85
        18 + (i % 67),
        
        -- Location
        locations[1 + (i % array_length(locations, 1))],
        
        -- Medical condition
        conditions[1 + (i % array_length(conditions, 1))],
        
        -- Last visit (within last 90 days)
        CURRENT_DATE - ((i % 90) || ' days')::interval,
        
        -- Hospital
        hospitals[1 + (i % array_length(hospitals, 1))],
        
        -- Vital signs with realistic variations
        jsonb_build_object(
          'blood_pressure', jsonb_build_object(
            'systolic', 110 + (i % 50),
            'diastolic', 70 + (i % 30)
          ),
          'blood_sugar', jsonb_build_object(
            'fasting', 90 + (i % 60),
            'post_prandial', 130 + (i % 90)
          ),
          'oxygen_saturation', 95 + (i % 5),
          'heart_rate', 60 + (i % 40),
          'temperature', 98.0 + (random() * 1.5),
          'respiratory_rate', 12 + (i % 8)
        ),
        
        -- Medical history
        jsonb_build_object(
          'chronic_conditions', ARRAY[conditions[1 + (i % array_length(conditions, 1))]],
          'past_medications', ARRAY['Medication ' || (i % 5 + 1)],
          'allergies', CASE WHEN i % 4 = 0 THEN ARRAY['Penicillin'] ELSE ARRAY[]::text[] END,
          'blood_type', blood_types[1 + (i % array_length(blood_types, 1))],
          'family_history', ARRAY[conditions[1 + ((i + 2) % array_length(conditions, 1))]]
        ),
        
        -- Lifestyle factors
        jsonb_build_object(
          'exercise_frequency', exercise_frequencies[1 + (i % array_length(exercise_frequencies, 1))],
          'sleep_hours', sleep_hours[1 + (i % array_length(sleep_hours, 1))],
          'stress_level', stress_levels[1 + (i % array_length(stress_levels, 1))],
          'smoking_status', smoking_statuses[1 + (i % array_length(smoking_statuses, 1))],
          'alcohol_consumption', alcohol_consumption[1 + (i % array_length(alcohol_consumption, 1))]
        ),
        
        -- Demographic info
        jsonb_build_object(
          'occupation', occupations[1 + (i % array_length(occupations, 1))],
          'education_level', education_levels[1 + (i % array_length(education_levels, 1))],
          'marital_status', marital_statuses[1 + (i % array_length(marital_statuses, 1))],
          'locality', localities[1 + (i % array_length(localities, 1))],
          'socioeconomic_status', socioeconomic_statuses[1 + (i % array_length(socioeconomic_statuses, 1))]
        ),
        
        -- User ID
        v_user_id
      );
    END LOOP;
  END IF;
END $$;