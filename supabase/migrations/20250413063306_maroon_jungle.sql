/*
  # Add Sample Data for AI Patient Monitoring System

  1. Sample Data
    - Create test user for sample data
    - Add 200 patients across different Indian cities
    - Add environmental data for major cities
    - Include varied medical histories and conditions

  2. Data Distribution
    - Patients across Mumbai, Chennai, and Kolkata
    - Environmental metrics for each city
    - Varied age groups and conditions
*/

-- First, create a test user in auth.users
INSERT INTO auth.users (id, email)
VALUES ('d7bed83c-44a0-4a4f-8467-719dad509183', 'test@example.com')
ON CONFLICT (id) DO NOTHING;

-- Insert environmental data for major cities
INSERT INTO environmental_data (location, air_quality, water_quality, pollution_level) VALUES
  ('Mumbai', 85, 75, 82),
  ('Chennai', 78, 82, 75),
  ('Kolkata', 92, 70, 88);

-- Insert sample patients with varied conditions and locations
DO $$
DECLARE
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
  i integer;
  chosen_location text;
  chosen_condition text;
  chosen_chronic jsonb;
  chosen_meds jsonb;
BEGIN
  FOR i IN 1..200 LOOP
    -- Randomly select location and condition
    chosen_location := locations[1 + floor(random() * array_length(locations, 1))];
    chosen_condition := conditions[1 + floor(random() * array_length(conditions, 1))];
    
    -- Create medical history JSON
    chosen_chronic := jsonb_build_array(
      chronic_conditions[1 + floor(random() * array_length(chronic_conditions, 1))]::text[]
    );
    chosen_meds := jsonb_build_array(
      medications[1 + floor(random() * array_length(medications, 1))]::text[]
    );

    INSERT INTO patients (
      name,
      age,
      location,
      condition,
      last_visit,
      medical_history,
      user_id
    ) VALUES (
      'Patient ' || i,
      20 + floor(random() * 60)::integer,
      chosen_location,
      chosen_condition,
      current_date - (floor(random() * 30)::integer || ' days')::interval,
      jsonb_build_object(
        'chronic_conditions', chosen_chronic,
        'past_medications', chosen_meds
      ),
      'd7bed83c-44a0-4a4f-8467-719dad509183'  -- Use the test user's ID
    );
  END LOOP;
END $$;