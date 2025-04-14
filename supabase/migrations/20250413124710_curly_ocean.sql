/*
  # Create Client Database Schema

  1. New Tables
    - client_patients: Stores client-specific patient data
    - client_appointments: Tracks client appointments
    - client_medical_records: Stores client medical records
    - client_prescriptions: Manages client prescriptions
    
  2. Security
    - Enable RLS on all tables
    - Add policies for client access
    
  3. Sample Data
    - Insert 20 sample patient records
    - Include diverse medical conditions and demographics
*/

-- Create client_patients table
CREATE TABLE IF NOT EXISTS client_patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL,
  blood_group text,
  contact_number text,
  email text,
  address jsonb DEFAULT '{"street": "", "city": "", "state": "", "postal_code": "", "country": "India"}'::jsonb,
  emergency_contact jsonb DEFAULT '{"name": "", "relationship": "", "phone": ""}'::jsonb,
  medical_history jsonb DEFAULT '{"allergies": [], "chronic_conditions": [], "past_surgeries": [], "family_history": []}'::jsonb,
  current_medications jsonb DEFAULT '[]'::jsonb,
  lifestyle_factors jsonb DEFAULT '{"smoking": false, "alcohol": false, "exercise_frequency": "None", "diet_type": "Regular"}'::jsonb,
  vital_signs jsonb DEFAULT '{
    "blood_pressure": {"systolic": 120, "diastolic": 80},
    "heart_rate": 72,
    "respiratory_rate": 16,
    "temperature": 98.6,
    "oxygen_saturation": 98,
    "height": 170,
    "weight": 70
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE client_patients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own patient profile"
ON client_patients FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own patient profile"
ON client_patients FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Insert 20 sample patients
INSERT INTO client_patients (
  name, age, gender, blood_group, contact_number, email,
  address, emergency_contact, medical_history, current_medications,
  lifestyle_factors, vital_signs
) VALUES
  (
    'Aarav Patel', 45, 'Male', 'O+', '+91-9876543210', 'aarav.patel@email.com',
    '{"street": "123 Gandhi Road", "city": "Mumbai", "state": "Maharashtra", "postal_code": "400001", "country": "India"}',
    '{"name": "Priya Patel", "relationship": "Spouse", "phone": "+91-9876543211"}',
    '{"allergies": ["Pollen"], "chronic_conditions": ["Hypertension"], "past_surgeries": [], "family_history": ["Diabetes"]}',
    '[{"name": "Amlodipine", "dosage": "5mg", "frequency": "Once daily"}]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "3 times/week", "diet_type": "Vegetarian"}',
    '{"blood_pressure": {"systolic": 138, "diastolic": 88}, "heart_rate": 76, "respiratory_rate": 16, "temperature": 98.6, "oxygen_saturation": 98, "height": 172, "weight": 75}'
  ),
  (
    'Priya Sharma', 32, 'Female', 'B+', '+91-9876543212', 'priya.sharma@email.com',
    '{"street": "456 Nehru Street", "city": "Delhi", "state": "Delhi", "postal_code": "110001", "country": "India"}',
    '{"name": "Rahul Sharma", "relationship": "Spouse", "phone": "+91-9876543213"}',
    '{"allergies": ["Dust"], "chronic_conditions": ["Asthma"], "past_surgeries": ["Appendectomy"], "family_history": ["Asthma"]}',
    '[{"name": "Salbutamol", "dosage": "100mcg", "frequency": "As needed"}]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "2 times/week", "diet_type": "Vegetarian"}',
    '{"blood_pressure": {"systolic": 120, "diastolic": 80}, "heart_rate": 72, "respiratory_rate": 18, "temperature": 98.4, "oxygen_saturation": 97, "height": 165, "weight": 58}'
  ),
  (
    'Rajesh Kumar', 55, 'Male', 'A+', '+91-9876543214', 'rajesh.kumar@email.com',
    '{"street": "789 Tagore Lane", "city": "Bangalore", "state": "Karnataka", "postal_code": "560001", "country": "India"}',
    '{"name": "Sunita Kumar", "relationship": "Spouse", "phone": "+91-9876543215"}',
    '{"allergies": [], "chronic_conditions": ["Type 2 Diabetes", "Hypertension"], "past_surgeries": ["Cataract"], "family_history": ["Heart Disease", "Diabetes"]}',
    '[{"name": "Metformin", "dosage": "500mg", "frequency": "Twice daily"}, {"name": "Losartan", "dosage": "50mg", "frequency": "Once daily"}]',
    '{"smoking": false, "alcohol": true, "exercise_frequency": "Daily", "diet_type": "Diabetic"}',
    '{"blood_pressure": {"systolic": 142, "diastolic": 92}, "heart_rate": 78, "respiratory_rate": 16, "temperature": 98.8, "oxygen_saturation": 96, "height": 168, "weight": 82}'
  ),
  (
    'Anita Desai', 28, 'Female', 'AB+', '+91-9876543216', 'anita.desai@email.com',
    '{"street": "101 Marine Drive", "city": "Mumbai", "state": "Maharashtra", "postal_code": "400002", "country": "India"}',
    '{"name": "Rakesh Desai", "relationship": "Father", "phone": "+91-9876543217"}',
    '{"allergies": ["Shellfish"], "chronic_conditions": [], "past_surgeries": [], "family_history": []}',
    '[]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "4 times/week", "diet_type": "Vegan"}',
    '{"blood_pressure": {"systolic": 118, "diastolic": 78}, "heart_rate": 68, "respiratory_rate": 16, "temperature": 98.6, "oxygen_saturation": 99, "height": 160, "weight": 55}'
  ),
  (
    'Suresh Reddy', 42, 'Male', 'O-', '+91-9876543218', 'suresh.reddy@email.com',
    '{"street": "234 Anna Salai", "city": "Chennai", "state": "Tamil Nadu", "postal_code": "600001", "country": "India"}',
    '{"name": "Lakshmi Reddy", "relationship": "Spouse", "phone": "+91-9876543219"}',
    '{"allergies": [], "chronic_conditions": ["Migraine"], "past_surgeries": [], "family_history": ["Hypertension"]}',
    '[{"name": "Sumatriptan", "dosage": "50mg", "frequency": "As needed"}]',
    '{"smoking": true, "alcohol": true, "exercise_frequency": "Occasional", "diet_type": "Non-vegetarian"}',
    '{"blood_pressure": {"systolic": 128, "diastolic": 82}, "heart_rate": 74, "respiratory_rate": 16, "temperature": 98.4, "oxygen_saturation": 98, "height": 175, "weight": 78}'
  ),
  (
    'Meera Iyer', 35, 'Female', 'B-', '+91-9876543220', 'meera.iyer@email.com',
    '{"street": "567 MG Road", "city": "Bangalore", "state": "Karnataka", "postal_code": "560002", "country": "India"}',
    '{"name": "Karthik Iyer", "relationship": "Spouse", "phone": "+91-9876543221"}',
    '{"allergies": ["Penicillin"], "chronic_conditions": ["Hypothyroidism"], "past_surgeries": [], "family_history": ["Thyroid disorders"]}',
    '[{"name": "Levothyroxine", "dosage": "25mcg", "frequency": "Once daily"}]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "5 times/week", "diet_type": "Vegetarian"}',
    '{"blood_pressure": {"systolic": 122, "diastolic": 80}, "heart_rate": 70, "respiratory_rate": 16, "temperature": 98.6, "oxygen_saturation": 98, "height": 162, "weight": 60}'
  ),
  (
    'Arjun Singh', 48, 'Male', 'A-', '+91-9876543222', 'arjun.singh@email.com',
    '{"street": "890 Rajpath", "city": "Delhi", "state": "Delhi", "postal_code": "110002", "country": "India"}',
    '{"name": "Neha Singh", "relationship": "Spouse", "phone": "+91-9876543223"}',
    '{"allergies": [], "chronic_conditions": ["Coronary Artery Disease"], "past_surgeries": ["Angioplasty"], "family_history": ["Heart Disease"]}',
    '[{"name": "Aspirin", "dosage": "75mg", "frequency": "Once daily"}, {"name": "Atorvastatin", "dosage": "20mg", "frequency": "Once daily"}]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "Daily", "diet_type": "Heart-healthy"}',
    '{"blood_pressure": {"systolic": 132, "diastolic": 84}, "heart_rate": 72, "respiratory_rate": 16, "temperature": 98.6, "oxygen_saturation": 97, "height": 170, "weight": 72}'
  ),
  (
    'Kavita Menon', 39, 'Female', 'AB-', '+91-9876543224', 'kavita.menon@email.com',
    '{"street": "345 Park Street", "city": "Kolkata", "state": "West Bengal", "postal_code": "700001", "country": "India"}',
    '{"name": "Arun Menon", "relationship": "Spouse", "phone": "+91-9876543225"}',
    '{"allergies": ["Latex"], "chronic_conditions": ["PCOS"], "past_surgeries": ["Laparoscopy"], "family_history": ["Diabetes"]}',
    '[{"name": "Metformin", "dosage": "500mg", "frequency": "Twice daily"}]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "3 times/week", "diet_type": "Low-carb"}',
    '{"blood_pressure": {"systolic": 118, "diastolic": 76}, "heart_rate": 68, "respiratory_rate": 16, "temperature": 98.4, "oxygen_saturation": 99, "height": 158, "weight": 65}'
  ),
  (
    'Vikram Malhotra', 52, 'Male', 'O+', '+91-9876543226', 'vikram.malhotra@email.com',
    '{"street": "678 Hill Road", "city": "Mumbai", "state": "Maharashtra", "postal_code": "400003", "country": "India"}',
    '{"name": "Anjali Malhotra", "relationship": "Spouse", "phone": "+91-9876543227"}',
    '{"allergies": [], "chronic_conditions": ["Gout", "Hypertension"], "past_surgeries": [], "family_history": ["Arthritis"]}',
    '[{"name": "Allopurinol", "dosage": "300mg", "frequency": "Once daily"}, {"name": "Amlodipine", "dosage": "5mg", "frequency": "Once daily"}]',
    '{"smoking": false, "alcohol": true, "exercise_frequency": "2 times/week", "diet_type": "Low-purine"}',
    '{"blood_pressure": {"systolic": 136, "diastolic": 88}, "heart_rate": 76, "respiratory_rate": 16, "temperature": 98.8, "oxygen_saturation": 97, "height": 173, "weight": 85}'
  ),
  (
    'Deepa Nair', 31, 'Female', 'B+', '+91-9876543228', 'deepa.nair@email.com',
    '{"street": "901 Beach Road", "city": "Chennai", "state": "Tamil Nadu", "postal_code": "600002", "country": "India"}',
    '{"name": "Mohan Nair", "relationship": "Spouse", "phone": "+91-9876543229"}',
    '{"allergies": ["Dust mites"], "chronic_conditions": ["Eczema"], "past_surgeries": [], "family_history": ["Asthma", "Allergies"]}',
    '[{"name": "Cetirizine", "dosage": "10mg", "frequency": "As needed"}]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "4 times/week", "diet_type": "Balanced"}',
    '{"blood_pressure": {"systolic": 120, "diastolic": 78}, "heart_rate": 70, "respiratory_rate": 16, "temperature": 98.6, "oxygen_saturation": 98, "height": 165, "weight": 58}'
  ),
  (
    'Rahul Verma', 44, 'Male', 'A+', '+91-9876543230', 'rahul.verma@email.com',
    '{"street": "123 Ring Road", "city": "Delhi", "state": "Delhi", "postal_code": "110003", "country": "India"}',
    '{"name": "Pooja Verma", "relationship": "Spouse", "phone": "+91-9876543231"}',
    '{"allergies": [], "chronic_conditions": ["Type 2 Diabetes"], "past_surgeries": ["Appendectomy"], "family_history": ["Diabetes", "Heart Disease"]}',
    '[{"name": "Metformin", "dosage": "1000mg", "frequency": "Twice daily"}]',
    '{"smoking": true, "alcohol": false, "exercise_frequency": "3 times/week", "diet_type": "Diabetic"}',
    '{"blood_pressure": {"systolic": 130, "diastolic": 84}, "heart_rate": 74, "respiratory_rate": 16, "temperature": 98.6, "oxygen_saturation": 98, "height": 171, "weight": 80}'
  ),
  (
    'Shalini Gupta', 37, 'Female', 'O+', '+91-9876543232', 'shalini.gupta@email.com',
    '{"street": "456 Lake View", "city": "Bangalore", "state": "Karnataka", "postal_code": "560003", "country": "India"}',
    '{"name": "Amit Gupta", "relationship": "Spouse", "phone": "+91-9876543233"}',
    '{"allergies": ["Peanuts"], "chronic_conditions": ["Migraine"], "past_surgeries": [], "family_history": ["Migraines"]}',
    '[{"name": "Rizatriptan", "dosage": "10mg", "frequency": "As needed"}]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "Daily", "diet_type": "Gluten-free"}',
    '{"blood_pressure": {"systolic": 118, "diastolic": 76}, "heart_rate": 68, "respiratory_rate": 16, "temperature": 98.4, "oxygen_saturation": 99, "height": 163, "weight": 56}'
  ),
  (
    'Karthik Krishnan', 49, 'Male', 'B+', '+91-9876543234', 'karthik.krishnan@email.com',
    '{"street": "789 Temple Street", "city": "Chennai", "state": "Tamil Nadu", "postal_code": "600003", "country": "India"}',
    '{"name": "Radha Krishnan", "relationship": "Spouse", "phone": "+91-9876543235"}',
    '{"allergies": [], "chronic_conditions": ["Hypertension", "High Cholesterol"], "past_surgeries": [], "family_history": ["Heart Disease"]}',
    '[{"name": "Losartan", "dosage": "50mg", "frequency": "Once daily"}, {"name": "Simvastatin", "dosage": "20mg", "frequency": "Once daily"}]',
    '{"smoking": false, "alcohol": true, "exercise_frequency": "2 times/week", "diet_type": "Low-fat"}',
    '{"blood_pressure": {"systolic": 140, "diastolic": 90}, "heart_rate": 76, "respiratory_rate": 16, "temperature": 98.6, "oxygen_saturation": 97, "height": 174, "weight": 83}'
  ),
  (
    'Maya Joshi', 33, 'Female', 'AB+', '+91-9876543236', 'maya.joshi@email.com',
    '{"street": "234 Green Park", "city": "Mumbai", "state": "Maharashtra", "postal_code": "400004", "country": "India"}',
    '{"name": "Nikhil Joshi", "relationship": "Spouse", "phone": "+91-9876543237"}',
    '{"allergies": ["Sulfa drugs"], "chronic_conditions": ["Anxiety"], "past_surgeries": [], "family_history": ["Depression"]}',
    '[{"name": "Escitalopram", "dosage": "10mg", "frequency": "Once daily"}]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "5 times/week", "diet_type": "Mediterranean"}',
    '{"blood_pressure": {"systolic": 116, "diastolic": 74}, "heart_rate": 70, "respiratory_rate": 16, "temperature": 98.6, "oxygen_saturation": 99, "height": 160, "weight": 54}'
  ),
  (
    'Ravi Shankar', 56, 'Male', 'A+', '+91-9876543238', 'ravi.shankar@email.com',
    '{"street": "567 Civil Lines", "city": "Delhi", "state": "Delhi", "postal_code": "110004", "country": "India"}',
    '{"name": "Geeta Shankar", "relationship": "Spouse", "phone": "+91-9876543239"}',
    '{"allergies": [], "chronic_conditions": ["COPD"], "past_surgeries": ["Knee Replacement"], "family_history": ["Arthritis"]}',
    '[{"name": "Tiotropium", "dosage": "18mcg", "frequency": "Once daily"}]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "Light daily", "diet_type": "Regular"}',
    '{"blood_pressure": {"systolic": 134, "diastolic": 86}, "heart_rate": 78, "respiratory_rate": 18, "temperature": 98.8, "oxygen_saturation": 95, "height": 169, "weight": 70}'
  ),
  (
    'Anjali Mehta', 41, 'Female', 'O-', '+91-9876543240', 'anjali.mehta@email.com',
    '{"street": "890 Jubilee Hills", "city": "Hyderabad", "state": "Telangana", "postal_code": "500001", "country": "India"}',
    '{"name": "Rajesh Mehta", "relationship": "Spouse", "phone": "+91-9876543241"}',
    '{"allergies": ["Dairy"], "chronic_conditions": ["IBS"], "past_surgeries": ["Gallbladder removal"], "family_history": ["Colon Cancer"]}',
    '[{"name": "Dicyclomine", "dosage": "10mg", "frequency": "As needed"}]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "3 times/week", "diet_type": "Low-FODMAP"}',
    '{"blood_pressure": {"systolic": 122, "diastolic": 78}, "heart_rate": 72, "respiratory_rate": 16, "temperature": 98.4, "oxygen_saturation": 98, "height": 164, "weight": 62}'
  ),
  (
    'Sameer Khan', 38, 'Male', 'B-', '+91-9876543242', 'sameer.khan@email.com',
    '{"street": "123 Salt Lake", "city": "Kolkata", "state": "West Bengal", "postal_code": "700002", "country": "India"}',
    '{"name": "Zara Khan", "relationship": "Spouse", "phone": "+91-9876543243"}',
    '{"allergies": [], "chronic_conditions": ["Psoriasis"], "past_surgeries": [], "family_history": ["Autoimmune disorders"]}',
    '[{"name": "Methotrexate", "dosage": "7.5mg", "frequency": "Weekly"}]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "4 times/week", "diet_type": "Anti-inflammatory"}',
    '{"blood_pressure": {"systolic": 124, "diastolic": 80}, "heart_rate": 70, "respiratory_rate": 16, "temperature": 98.6, "oxygen_saturation": 98, "height": 176, "weight": 75}'
  ),
  (
    'Lakshmi Rao', 46, 'Female', 'A+', '+91-9876543244', 'lakshmi.rao@email.com',
    '{"street": "456 Koramangala", "city": "Bangalore", "state": "Karnataka", "postal_code": "560004", "country": "India"}',
    '{"name": "Venkat Rao", "relationship": "Spouse", "phone": "+91-9876543245"}',
    '{"allergies": ["Aspirin"], "chronic_conditions": ["Rheumatoid Arthritis"], "past_surgeries": [], "family_history": ["Arthritis"]}',
    '[{"name": "Hydroxychloroquine", "dosage": "200mg", "frequency": "Twice daily"}]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "Gentle daily", "diet_type": "Anti-inflammatory"}',
    '{"blood_pressure": {"systolic": 126, "diastolic": 82}, "heart_rate": 74, "respiratory_rate": 16, "temperature": 98.6, "oxygen_saturation": 98, "height": 161, "weight": 64}'
  ),
  (
    'Anil Kumar', 51, 'Male', 'AB+', '+91-9876543246', 'anil.kumar@email.com',
    '{"street": "789 T Nagar", "city": "Chennai", "state": "Tamil Nadu", "postal_code": "600004", "country": "India"}',
    '{"name": "Sudha Kumar", "relationship": "Spouse", "phone": "+91-9876543247"}',
    '{"allergies": [], "chronic_conditions": ["Sleep Apnea", "Obesity"], "past_surgeries": [], "family_history": ["Diabetes"]}',
    '[{"name": "CPAP therapy", "dosage": "N/A", "frequency": "Nightly"}]',
    '{"smoking": false, "alcohol": true, "exercise_frequency": "Starting", "diet_type": "Weight loss"}',
    '{"blood_pressure": {"systolic": 138, "diastolic": 88}, "heart_rate": 80, "respiratory_rate": 18, "temperature": 98.8, "oxygen_saturation": 96, "height": 172, "weight": 95}'
  ),
  (
    'Neha Kapoor', 29, 'Female', 'O+', '+91-9876543248', 'neha.kapoor@email.com',
    '{"street": "101 Bandra West", "city": "Mumbai", "state": "Maharashtra", "postal_code": "400005", "country": "India"}',
    '{"name": "Rohit Kapoor", "relationship": "Spouse", "phone": "+91-9876543249"}',
    '{"allergies": ["Gluten"], "chronic_conditions": ["Celiac Disease"], "past_surgeries": ["Tonsillectomy"], "family_history": ["Autoimmune disorders"]}',
    '[]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "6 times/week", "diet_type": "Gluten-free"}',
    '{"blood_pressure": {"systolic": 114, "diastolic": 74}, "heart_rate": 68, "respiratory_rate": 16, "temperature": 98.4, "oxygen_saturation": 99, "height": 159, "weight": 52}'
  ),
  (
    'Ramesh Pillai', 47, 'Male', 'B+', '+91-9876543250', 'ramesh.pillai@email.com',
    '{"street": "234 Adyar", "city": "Chennai", "state": "Tamil Nadu", "postal_code": "600005", "country": "India"}',
    '{"name": "Uma Pillai", "relationship": "Spouse", "phone": "+91-9876543251"}',
    '{"allergies": [], "chronic_conditions": ["Chronic Back Pain"], "past_surgeries": ["Disc Surgery"], "family_history": ["Osteoporosis"]}',
    '[{"name": "Gabapentin", "dosage": "300mg", "frequency": "Twice daily"}]',
    '{"smoking": false, "alcohol": false, "exercise_frequency": "Physical therapy", "diet_type": "Regular"}',
    '{"blood_pressure": {"systolic": 128, "diastolic": 82}, "heart_rate": 72, "respiratory_rate": 16, "temperature": 98.6, "oxygen_saturation": 98, "height": 170, "weight": 73}'
  );

-- Create client_appointments table
CREATE TABLE IF NOT EXISTS client_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES client_patients(id),
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  doctor_name text NOT NULL,
  specialization text NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE client_appointments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own appointments"
ON client_appointments FOR SELECT
TO authenticated
USING (
  patient_id IN (
    SELECT id FROM client_patients WHERE user_id = auth.uid()
  )
);

-- Create client_medical_records table
CREATE TABLE IF NOT EXISTS client_medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES client_patients(id),
  visit_date date NOT NULL,
  doctor_name text NOT NULL,
  diagnosis text NOT NULL,
  treatment_plan text NOT NULL,
  prescriptions jsonb,
  lab_results jsonb,
  follow_up_date date,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE client_medical_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own medical records"
ON client_medical_records FOR SELECT
TO authenticated
USING (
  patient_id IN (
    SELECT id FROM client_patients WHERE user_id = auth.uid()
  )
);

-- Create client_prescriptions table
CREATE TABLE IF NOT EXISTS client_prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES client_patients(id),
  prescription_date date NOT NULL,
  doctor_name text NOT NULL,
  medications jsonb NOT NULL,
  instructions text,
  duration text,
  refills integer DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE client_prescriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own prescriptions"
ON client_prescriptions FOR SELECT
TO authenticated
USING (
  patient_id IN (
    SELECT id FROM client_patients WHERE user_id = auth.uid()
  )
);