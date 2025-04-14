/*
  # Add profile images and detailed information

  1. Changes
    - Add profile image URLs to patients and specialists
    - Add detailed address information
    - Add additional contact details
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add columns to patients table
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS profile_image_url text,
ADD COLUMN IF NOT EXISTS address jsonb DEFAULT '{
  "street": "",
  "city": "",
  "state": "",
  "postal_code": "",
  "country": "India"
}'::jsonb,
ADD COLUMN IF NOT EXISTS contact_details jsonb DEFAULT '{
  "phone": "",
  "emergency_contact": {
    "name": "",
    "relationship": "",
    "phone": ""
  }
}'::jsonb;

-- Add columns to specialists table
ALTER TABLE specialists
ADD COLUMN IF NOT EXISTS profile_image_url text,
ADD COLUMN IF NOT EXISTS address jsonb DEFAULT '{
  "street": "",
  "city": "",
  "state": "",
  "postal_code": "",
  "country": "India"
}'::jsonb,
ADD COLUMN IF NOT EXISTS qualifications jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS languages_spoken text[] DEFAULT '{English, Hindi}'::text[];

-- Update existing specialists with sample data
UPDATE specialists
SET 
  profile_image_url = CASE name
    WHEN 'Dr. Priya Sharma' THEN 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
    WHEN 'Dr. Rajesh Kumar' THEN 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
    WHEN 'Dr. Anita Desai' THEN 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300'
    ELSE 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
  END,
  address = jsonb_build_object(
    'street', CASE location
      WHEN 'Mumbai' THEN '123 Marine Drive'
      WHEN 'Delhi' THEN '456 Connaught Place'
      WHEN 'Bangalore' THEN '789 MG Road'
      WHEN 'Chennai' THEN '321 Anna Salai'
      ELSE '100 Hospital Road'
    END,
    'city', location,
    'state', CASE location
      WHEN 'Mumbai' THEN 'Maharashtra'
      WHEN 'Delhi' THEN 'Delhi'
      WHEN 'Bangalore' THEN 'Karnataka'
      WHEN 'Chennai' THEN 'Tamil Nadu'
      ELSE 'Maharashtra'
    END,
    'postal_code', '400001',
    'country', 'India'
  ),
  qualifications = jsonb_build_array(
    jsonb_build_object(
      'degree', 'MBBS',
      'institution', 'AIIMS Delhi',
      'year', '2010'
    ),
    jsonb_build_object(
      'degree', 'MD',
      'institution', 'KEM Hospital Mumbai',
      'year', '2014'
    )
  ),
  languages_spoken = ARRAY['English', 'Hindi', 'Marathi', 'Gujarati']
WHERE profile_image_url IS NULL;

-- Update existing patients with sample data
UPDATE patients
SET 
  profile_image_url = CASE 
    WHEN age < 30 THEN 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&q=80&w=300'
    WHEN age < 50 THEN 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300'
    ELSE 'https://images.unsplash.com/photo-1569124589354-615739ae007b?auto=format&fit=crop&q=80&w=300'
  END,
  address = jsonb_build_object(
    'street', '123 Patient Street',
    'city', location,
    'state', CASE location
      WHEN 'Mumbai' THEN 'Maharashtra'
      WHEN 'Delhi' THEN 'Delhi'
      WHEN 'Bangalore' THEN 'Karnataka'
      WHEN 'Chennai' THEN 'Tamil Nadu'
      ELSE 'Maharashtra'
    END,
    'postal_code', '400001',
    'country', 'India'
  ),
  contact_details = jsonb_build_object(
    'phone', '+91 9876543210',
    'emergency_contact', jsonb_build_object(
      'name', 'Family Member',
      'relationship', 'Spouse',
      'phone', '+91 9876543211'
    )
  )
WHERE profile_image_url IS NULL;