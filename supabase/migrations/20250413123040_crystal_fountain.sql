/*
  # Create predictive analysis data for all patients

  1. Changes
    - Creates predictive analysis data for each patient
    - Includes vital signs, risk factors, disease predictions, and recommendations
    - Sets up realistic medical analysis data
    
  2. Security
    - Maintains existing RLS policies
    - Only authorized users can access their relevant data
*/

-- Insert predictive analysis data for each patient
INSERT INTO patient_predictive_analysis (
  patient_id,
  analysis_date,
  vital_signs,
  risk_factors,
  disease_predictions,
  lifestyle_impact,
  environmental_factors,
  medical_history_analysis,
  recommendations,
  specialist_referrals,
  suggested_treatments,
  analysis_version,
  confidence_score
)
SELECT 
  id as patient_id,
  NOW() as analysis_date,
  jsonb_build_object(
    'heart_rate', vital_signs->'heart_rate',
    'temperature', vital_signs->'temperature',
    'blood_pressure', vital_signs->'blood_pressure',
    'respiratory_rate', vital_signs->'respiratory_rate',
    'oxygen_saturation', vital_signs->'oxygen_saturation'
  ) as vital_signs,
  jsonb_build_array(
    jsonb_build_object(
      'factor', 'Age-related Risk',
      'severity', CASE 
        WHEN age > 60 THEN 'High'
        WHEN age > 40 THEN 'Medium'
        ELSE 'Low'
      END,
      'impact', CASE 
        WHEN age > 60 THEN 0.8
        WHEN age > 40 THEN 0.5
        ELSE 0.2
      END,
      'description', 'Risk factors based on patient age',
      'contributing_factors', ARRAY['Age', 'General Health Status']
    ),
    jsonb_build_object(
      'factor', 'Lifestyle Impact',
      'severity', CASE 
        WHEN lifestyle_factors->>'smoking_status' = 'Current smoker' THEN 'High'
        WHEN lifestyle_factors->>'alcohol_consumption' = 'Regular' THEN 'Medium'
        ELSE 'Low'
      END,
      'impact', CASE 
        WHEN lifestyle_factors->>'smoking_status' = 'Current smoker' THEN 0.9
        WHEN lifestyle_factors->>'alcohol_consumption' = 'Regular' THEN 0.6
        ELSE 0.3
      END,
      'description', 'Impact of current lifestyle choices',
      'contributing_factors', ARRAY['Smoking', 'Alcohol Consumption', 'Exercise Habits']
    )
  ) as risk_factors,
  jsonb_build_array(
    jsonb_build_object(
      'condition', condition,
      'probability', 0.7,
      'key_indicators', ARRAY['Current Symptoms', 'Medical History', 'Lifestyle Factors']
    ),
    jsonb_build_object(
      'condition', 'Secondary Risk',
      'probability', 0.4,
      'key_indicators', ARRAY['Age', 'Family History', 'Environmental Factors']
    )
  ) as disease_predictions,
  jsonb_build_object(
    'diet', jsonb_build_object(
      'score', 0.65,
      'factors', ARRAY['Current Diet Type', 'Nutritional Balance', 'Meal Timing'],
      'recommendations', ARRAY['Increase protein intake', 'Add more vegetables', 'Regular meal schedule']
    ),
    'sleep', jsonb_build_object(
      'score', 0.75,
      'factors', ARRAY['Sleep Duration', 'Sleep Quality', 'Sleep Schedule'],
      'recommendations', ARRAY['Maintain regular sleep schedule', 'Create bedtime routine', 'Optimize sleep environment']
    ),
    'stress', jsonb_build_object(
      'score', 0.55,
      'factors', ARRAY['Work Pressure', 'Personal Life', 'Coping Mechanisms'],
      'recommendations', ARRAY['Practice meditation', 'Regular exercise', 'Time management']
    ),
    'exercise', jsonb_build_object(
      'score', 0.60,
      'factors', ARRAY['Current Activity Level', 'Exercise Type', 'Frequency'],
      'recommendations', ARRAY['Increase activity level', 'Add strength training', 'Include cardio exercises']
    )
  ) as lifestyle_impact,
  jsonb_build_object(
    'seasonal_effects', ARRAY['Pollen Sensitivity', 'Weather Changes', 'Seasonal Illnesses'],
    'air_quality_impact', 0.65,
    'geographical_risks', ARRAY['Urban Environment', 'Industrial Proximity'],
    'weather_sensitivity', 0.45
  ) as environmental_factors,
  jsonb_build_object(
    'genetic_factors', ARRAY['Family History of Heart Disease', 'Genetic Predisposition to Diabetes'],
    'chronic_conditions', medical_history->'chronic_conditions',
    'previous_conditions', ARRAY['Past Surgeries', 'Childhood Illnesses'],
    'family_history_impact', medical_history->'family_history'
  ) as medical_history_analysis,
  jsonb_build_array(
    jsonb_build_object(
      'category', 'Immediate Actions',
      'priority', 'High',
      'recommendations', ARRAY['Schedule follow-up appointment', 'Begin prescribed medication', 'Monitor vital signs'],
      'timeline', '1-2 weeks',
      'expected_benefits', ARRAY['Symptom management', 'Condition stabilization']
    ),
    jsonb_build_object(
      'category', 'Lifestyle Changes',
      'priority', 'Medium',
      'recommendations', ARRAY['Modify diet', 'Increase physical activity', 'Stress management'],
      'timeline', '2-3 months',
      'expected_benefits', ARRAY['Improved overall health', 'Better disease management']
    )
  ) as recommendations,
  jsonb_build_array(
    jsonb_build_object(
      'specialization', 'Primary Care',
      'reason', 'Regular monitoring and management',
      'priority', 'Medium'
    ),
    jsonb_build_object(
      'specialization', CASE 
        WHEN condition LIKE '%heart%' THEN 'Cardiologist'
        WHEN condition LIKE '%diabetes%' THEN 'Endocrinologist'
        WHEN condition LIKE '%respiratory%' THEN 'Pulmonologist'
        ELSE 'Specialist'
      END,
      'reason', 'Specialized treatment and monitoring',
      'priority', 'High'
    )
  ) as specialist_referrals,
  jsonb_build_object(
    'therapies', ARRAY['Physical Therapy', 'Occupational Therapy'],
    'medications', ARRAY['Current Prescriptions', 'Recommended Supplements'],
    'preventive_care', ARRAY['Regular Check-ups', 'Vaccination Updates'],
    'follow_up_schedule', ARRAY['Weekly vital monitoring', 'Monthly specialist visit', 'Quarterly evaluation']
  ) as suggested_treatments,
  '1.0' as analysis_version,
  0.85 as confidence_score
FROM patients
WHERE NOT EXISTS (
  SELECT 1 
  FROM patient_predictive_analysis 
  WHERE patient_predictive_analysis.patient_id = patients.id
);