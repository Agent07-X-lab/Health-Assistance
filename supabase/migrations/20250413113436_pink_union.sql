/*
  # Add consultation fee and sample specialists data

  1. Schema Changes
    - Add consultation_fee column to specialists table
    - Add sample specialists data with diverse specializations
    - Add availability records for each specialist with duplicate check

  2. Data Distribution
    - Multiple specialists per category
    - Geographic spread across major cities
    - Various experience levels and fee ranges
    - Diverse language capabilities
*/

-- Add consultation_fee column to specialists table if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'specialists' AND column_name = 'consultation_fee'
  ) THEN
    ALTER TABLE specialists ADD COLUMN consultation_fee numeric DEFAULT 0;
  END IF;
END $$;

-- Insert sample specialists data
INSERT INTO specialists (
  name,
  specialization,
  hospital_name,
  location,
  contact_number,
  email,
  availability,
  experience_years,
  consultation_fee,
  profile_image_url,
  address,
  qualifications,
  languages_spoken
) VALUES
  (
    'Dr. Priya Sharma',
    'Cardiologist',
    'Apollo Hospitals',
    'Mumbai',
    '+91-9876543210',
    'priya.sharma@apollo.com',
    'Mon-Fri: 9:00 AM - 5:00 PM',
    15,
    2500,
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    '{"street": "Parel", "city": "Mumbai", "state": "Maharashtra", "country": "India", "postal_code": "400012"}'::jsonb,
    '[{"degree": "MBBS", "institution": "AIIMS Delhi", "year": "2005"}, {"degree": "MD Cardiology", "institution": "PGIMER Chandigarh", "year": "2008"}]'::jsonb,
    ARRAY['English', 'Hindi', 'Marathi']
  ),
  (
    'Dr. Rajesh Kumar',
    'Neurologist',
    'Fortis Hospital',
    'Delhi',
    '+91-9876543211',
    'rajesh.kumar@fortis.com',
    'Mon-Sat: 10:00 AM - 6:00 PM',
    20,
    3000,
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    '{"street": "Vasant Kunj", "city": "New Delhi", "state": "Delhi", "country": "India", "postal_code": "110070"}'::jsonb,
    '[{"degree": "MBBS", "institution": "Maulana Azad Medical College", "year": "2000"}, {"degree": "DM Neurology", "institution": "AIIMS Delhi", "year": "2004"}]'::jsonb,
    ARRAY['English', 'Hindi', 'Punjabi']
  ),
  (
    'Dr. Meera Patel',
    'Pediatrician',
    'Rainbow Children''s Hospital',
    'Bangalore',
    '+91-9876543212',
    'meera.patel@rainbow.com',
    'Mon-Fri: 9:00 AM - 7:00 PM',
    12,
    1800,
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300',
    '{"street": "Marathahalli", "city": "Bangalore", "state": "Karnataka", "country": "India", "postal_code": "560037"}'::jsonb,
    '[{"degree": "MBBS", "institution": "St. Johns Medical College", "year": "2008"}, {"degree": "MD Pediatrics", "institution": "JIPMER", "year": "2011"}]'::jsonb,
    ARRAY['English', 'Hindi', 'Kannada']
  ),
  (
    'Dr. Arun Menon',
    'Dermatologist',
    'Manipal Hospitals',
    'Chennai',
    '+91-9876543213',
    'arun.menon@manipal.com',
    'Tue-Sun: 11:00 AM - 7:00 PM',
    10,
    2000,
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    '{"street": "Anna Nagar", "city": "Chennai", "state": "Tamil Nadu", "country": "India", "postal_code": "600040"}'::jsonb,
    '[{"degree": "MBBS", "institution": "Madras Medical College", "year": "2010"}, {"degree": "MD Dermatology", "institution": "AIIMS Delhi", "year": "2013"}]'::jsonb,
    ARRAY['English', 'Tamil', 'Malayalam']
  ),
  (
    'Dr. Sanjay Gupta',
    'Orthopedic Surgeon',
    'Max Healthcare',
    'Delhi',
    '+91-9876543214',
    'sanjay.gupta@max.com',
    'Mon-Sat: 9:30 AM - 5:30 PM',
    18,
    2800,
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300',
    '{"street": "Saket", "city": "New Delhi", "state": "Delhi", "country": "India", "postal_code": "110017"}'::jsonb,
    '[{"degree": "MBBS", "institution": "KGMC Lucknow", "year": "2002"}, {"degree": "MS Orthopedics", "institution": "AIIMS Delhi", "year": "2005"}]'::jsonb,
    ARRAY['English', 'Hindi']
  ),
  (
    'Dr. Anita Desai',
    'Gynecologist',
    'Cloudnine Hospital',
    'Mumbai',
    '+91-9876543215',
    'anita.desai@cloudnine.com',
    'Mon-Fri: 10:00 AM - 6:00 PM',
    14,
    2200,
    'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300',
    '{"street": "Malad West", "city": "Mumbai", "state": "Maharashtra", "country": "India", "postal_code": "400064"}'::jsonb,
    '[{"degree": "MBBS", "institution": "Seth GS Medical College", "year": "2006"}, {"degree": "MD Gynecology", "institution": "KEM Hospital", "year": "2009"}]'::jsonb,
    ARRAY['English', 'Hindi', 'Gujarati', 'Marathi']
  ),
  (
    'Dr. Karthik Raman',
    'Psychiatrist',
    'NIMHANS',
    'Bangalore',
    '+91-9876543216',
    'karthik.raman@nimhans.com',
    'Mon-Fri: 9:00 AM - 4:00 PM',
    16,
    2500,
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    '{"street": "Hosur Road", "city": "Bangalore", "state": "Karnataka", "country": "India", "postal_code": "560029"}'::jsonb,
    '[{"degree": "MBBS", "institution": "Bangalore Medical College", "year": "2004"}, {"degree": "MD Psychiatry", "institution": "NIMHANS", "year": "2007"}]'::jsonb,
    ARRAY['English', 'Kannada', 'Tamil', 'Hindi']
  ),
  (
    'Dr. Fatima Ahmed',
    'Endocrinologist',
    'Medanta Hospital',
    'Kolkata',
    '+91-9876543217',
    'fatima.ahmed@medanta.com',
    'Mon-Sat: 10:30 AM - 6:30 PM',
    13,
    2400,
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300',
    '{"street": "Salt Lake", "city": "Kolkata", "state": "West Bengal", "country": "India", "postal_code": "700091"}'::jsonb,
    '[{"degree": "MBBS", "institution": "Calcutta Medical College", "year": "2007"}, {"degree": "DM Endocrinology", "institution": "PGIMER", "year": "2011"}]'::jsonb,
    ARRAY['English', 'Bengali', 'Hindi']
  ),
  (
    'Dr. Vivek Nair',
    'Pulmonologist',
    'Narayana Health',
    'Chennai',
    '+91-9876543218',
    'vivek.nair@narayana.com',
    'Tue-Sun: 9:00 AM - 5:00 PM',
    11,
    2100,
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    '{"street": "Nandanam", "city": "Chennai", "state": "Tamil Nadu", "country": "India", "postal_code": "600035"}'::jsonb,
    '[{"degree": "MBBS", "institution": "Stanley Medical College", "year": "2009"}, {"degree": "MD Pulmonology", "institution": "CMC Vellore", "year": "2012"}]'::jsonb,
    ARRAY['English', 'Tamil', 'Malayalam']
  ),
  (
    'Dr. Ritu Verma',
    'Ophthalmologist',
    'Sankara Nethralaya',
    'Mumbai',
    '+91-9876543219',
    'ritu.verma@sankara.com',
    'Mon-Sat: 9:00 AM - 6:00 PM',
    17,
    1900,
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300',
    '{"street": "Vashi", "city": "Navi Mumbai", "state": "Maharashtra", "country": "India", "postal_code": "400703"}'::jsonb,
    '[{"degree": "MBBS", "institution": "GMC Mumbai", "year": "2003"}, {"degree": "MS Ophthalmology", "institution": "AIIMS", "year": "2006"}]'::jsonb,
    ARRAY['English', 'Hindi', 'Marathi']
  );

-- Create doctor availability records for each specialist
DO $$
DECLARE
  specialist RECORD;
  day_info RECORD;
BEGIN
  FOR specialist IN SELECT id, location, consultation_fee FROM specialists
  LOOP
    FOR day_info IN 
      SELECT unnest(ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) as day_of_week
    LOOP
      -- Check if availability record already exists
      IF NOT EXISTS (
        SELECT 1 FROM doctor_availability 
        WHERE doctor_id = specialist.id AND day_of_week = day_info.day_of_week
      ) THEN
        -- Insert new availability record
        INSERT INTO doctor_availability (
          doctor_id,
          day_of_week,
          start_time,
          end_time,
          max_appointments,
          location,
          consultation_fee,
          is_available
        ) VALUES (
          specialist.id,
          day_info.day_of_week,
          '09:00:00'::time,
          '17:00:00'::time,
          12,
          specialist.location,
          specialist.consultation_fee,
          true
        );
      END IF;
    END LOOP;
  END LOOP;
END $$;