/*
  # Fix Environmental Health Impact Analysis

  1. Changes
    - Fixes SQL syntax for updating environmental factors
    - Adds proper JSON handling for disease predictions
    - Maintains all existing functionality with corrected syntax
    
  2. Security
    - Maintains existing RLS policies
    - Only authorized users can access their relevant data
*/

-- Update existing patient predictive analysis with enhanced environmental factors
DO $$ 
BEGIN
  UPDATE patient_predictive_analysis
  SET environmental_factors = jsonb_build_object(
    'air_quality', jsonb_build_object(
      'impact_score', (
        SELECT 
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM live_location_data lld
              WHERE lld.location = (
                SELECT location FROM patients WHERE id = patient_predictive_analysis.patient_id
              )
              AND lld.air_quality_index > 150
            ) THEN 0.9
            WHEN EXISTS (
              SELECT 1 FROM live_location_data lld
              WHERE lld.location = (
                SELECT location FROM patients WHERE id = patient_predictive_analysis.patient_id
              )
              AND lld.air_quality_index > 100
            ) THEN 0.7
            ELSE 0.4
          END
      ),
      'risk_level', (
        SELECT 
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM live_location_data lld
              WHERE lld.location = (
                SELECT location FROM patients WHERE id = patient_predictive_analysis.patient_id
              )
              AND lld.air_quality_index > 150
            ) THEN 'High'
            WHEN EXISTS (
              SELECT 1 FROM live_location_data lld
              WHERE lld.location = (
                SELECT location FROM patients WHERE id = patient_predictive_analysis.patient_id
              )
              AND lld.air_quality_index > 100
            ) THEN 'Medium'
            ELSE 'Low'
          END
      ),
      'health_effects', jsonb_build_array(
        'Respiratory irritation',
        'Allergic reactions',
        'Reduced lung function'
      )
    ),
    'weather_sensitivity', jsonb_build_object(
      'impact_score', (
        SELECT 
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM live_location_data lld
              WHERE lld.location = (
                SELECT location FROM patients WHERE id = patient_predictive_analysis.patient_id
              )
              AND (lld.temperature > 35 OR lld.temperature < 10)
            ) THEN 0.8
            ELSE 0.5
          END
      ),
      'risk_factors', jsonb_build_array(
        'Temperature extremes',
        'Humidity variations',
        'Pressure changes'
      )
    ),
    'pollution_exposure', jsonb_build_object(
      'impact_score', (
        SELECT 
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM live_location_data lld
              WHERE lld.location = (
                SELECT location FROM patients WHERE id = patient_predictive_analysis.patient_id
              )
              AND lld.pollution_level > 75
            ) THEN 0.85
            WHEN EXISTS (
              SELECT 1 FROM live_location_data lld
              WHERE lld.location = (
                SELECT location FROM patients WHERE id = patient_predictive_analysis.patient_id
              )
              AND lld.pollution_level > 50
            ) THEN 0.6
            ELSE 0.3
          END
      ),
      'exposure_duration', '8+ hours daily',
      'mitigation_measures', jsonb_build_array(
        'Use air purifiers',
        'Wear protective masks',
        'Limit outdoor activities'
      )
    ),
    'seasonal_patterns', jsonb_build_object(
      'current_season', (
        SELECT 
          CASE 
            WHEN EXTRACT(MONTH FROM CURRENT_DATE) IN (3,4,5) THEN 'Spring'
            WHEN EXTRACT(MONTH FROM CURRENT_DATE) IN (6,7,8) THEN 'Summer'
            WHEN EXTRACT(MONTH FROM CURRENT_DATE) IN (9,10,11) THEN 'Fall'
            ELSE 'Winter'
          END
      ),
      'seasonal_risks', jsonb_build_array(
        'Pollen allergies in Spring',
        'Heat stress in Summer',
        'Respiratory issues in Winter'
      )
    ),
    'geographical_factors', jsonb_build_object(
      'location_type', (
        SELECT 
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM environmental_data ed
              WHERE ed.location = (
                SELECT location FROM patients WHERE id = patient_predictive_analysis.patient_id
              )
              AND ed.pollution_level > 70
            ) THEN 'Urban-Industrial'
            ELSE 'Urban-Residential'
          END
      ),
      'risk_factors', jsonb_build_array(
        'Industrial proximity',
        'Traffic density',
        'Green space access'
      )
    ),
    'recommendations', jsonb_build_array(
      jsonb_build_object(
        'category', 'Immediate Actions',
        'priority', (
          SELECT 
            CASE 
              WHEN EXISTS (
                SELECT 1 FROM live_location_data lld
                WHERE lld.location = (
                  SELECT location FROM patients WHERE id = patient_predictive_analysis.patient_id
                )
                AND (lld.air_quality_index > 150 OR lld.pollution_level > 75)
              ) THEN 'High'
              ELSE 'Medium'
            END
        ),
        'actions', jsonb_build_array(
          'Monitor air quality index daily',
          'Use air purifiers indoors',
          'Wear appropriate protection outdoors'
        )
      ),
      jsonb_build_object(
        'category', 'Long-term Measures',
        'priority', 'Medium',
        'actions', jsonb_build_array(
          'Consider air quality when planning outdoor activities',
          'Install air quality monitors at home',
          'Regular health check-ups'
        )
      )
    )
  );

  -- Update disease predictions with environmental impact
  UPDATE patient_predictive_analysis
  SET disease_predictions = (
    SELECT jsonb_agg(
      CASE 
        WHEN (value->>'condition') LIKE '%respiratory%' OR 
             (value->>'condition') LIKE '%asthma%' OR 
             (value->>'condition') LIKE '%allergy%'
        THEN jsonb_set(
          value,
          '{probability}',
          to_jsonb(
            LEAST(1.0, (value->>'probability')::float + 
            CASE 
              WHEN EXISTS (
                SELECT 1 FROM live_location_data lld
                WHERE lld.location = (
                  SELECT location FROM patients WHERE id = patient_predictive_analysis.patient_id
                )
                AND lld.air_quality_index > 150
              ) THEN 0.2
              WHEN EXISTS (
                SELECT 1 FROM live_location_data lld
                WHERE lld.location = (
                  SELECT location FROM patients WHERE id = patient_predictive_analysis.patient_id
                )
                AND lld.air_quality_index > 100
              ) THEN 0.1
              ELSE 0
            END)
          )
        )
        ELSE value
      END
    )
    FROM jsonb_array_elements(disease_predictions) value
  );
END $$;