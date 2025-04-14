-- Insert client user if not exists
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  'b4c19431-0e9d-4949-a2e7-3a9831bf4c6e',
  'authenticated',
  'authenticated',
  'client@healthcare.com',
  crypt('client123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'client@healthcare.com'
);

-- Insert into public.users table
INSERT INTO public.users (id, role)
VALUES ('b4c19431-0e9d-4949-a2e7-3a9831bf4c6e', 'client')
ON CONFLICT (id) DO NOTHING;

-- Insert client patient record
INSERT INTO client_patients (
  user_id,
  name,
  age,
  gender,
  blood_group,
  contact_number,
  email,
  address,
  emergency_contact,
  medical_history,
  current_medications,
  lifestyle_factors,
  vital_signs
) VALUES (
  'b4c19431-0e9d-4949-a2e7-3a9831bf4c6e',
  'John Smith',
  35,
  'Male',
  'O+',
  '+91-9876543200',
  'client@healthcare.com',
  '{"street": "123 Health Street", "city": "Mumbai", "state": "Maharashtra", "postal_code": "400001", "country": "India"}',
  '{"name": "Jane Smith", "relationship": "Spouse", "phone": "+91-9876543201"}',
  '{"allergies": ["Pollen"], "chronic_conditions": ["Asthma"], "past_surgeries": [], "family_history": ["Diabetes"]}',
  '[{"name": "Ventolin", "dosage": "100mcg", "frequency": "As needed"}]',
  '{"smoking": false, "alcohol": false, "exercise_frequency": "3 times/week", "diet_type": "Regular"}',
  '{
    "blood_pressure": {"systolic": 120, "diastolic": 80},
    "heart_rate": 72,
    "respiratory_rate": 16,
    "temperature": 98.6,
    "oxygen_saturation": 98,
    "height": 175,
    "weight": 70
  }'
);