export interface Patient {
  id: string;
  name: string;
  age: number;
  location: string;
  condition: string;
  last_visit: string;
  medical_history: {
    chronic_conditions: string[];
    family_history: string[];
    allergies: string[];
    surgeries: string[];
  };
  vital_signs: {
    blood_pressure: {
      systolic: number;
      diastolic: number;
    };
    blood_sugar: {
      fasting: number;
      post_prandial: number;
    };
    heart_rate: number;
    respiratory_rate: number;
    temperature: number;
    oxygen_saturation: number;
  };
  lifestyle_factors: {
    smoking_status: string;
    alcohol_consumption: string;
    exercise_frequency: string;
    diet_type: string;
  };
  hospital_name: string;
  profile_image_url?: string;
  user_id: string;
  created_at: string;
}

export interface Disease {
  name: string;
  probability: number;
  symptoms: string[];
  remedies: Array<{
    type: string;
    description: string;
    instructions: string;
    duration: string;
    effectiveness: number;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    cost: number;
    side_effects: string[];
  }>;
  tests: Array<{
    name: string;
    purpose: string;
    cost: number;
    preparation: string;
    duration: string;
  }>;
}

export interface PredictionResult {
  diseases: Disease[];
  environmentalFactors: Array<{
    impact: string;
    score: number;
  }>;
  recommended_specialists: string[];
  vital_signs_analysis: {
    blood_pressure_status: string;
    blood_sugar_status: string;
    oxygen_status: string;
    overall_health_score: number;
  };
  risk_level: 'Low' | 'Medium' | 'High';
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  prescription_date: string;
  diagnosis: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    cost: number;
  }>;
  instructions: string;
  follow_up_date: string;
  prescription_image_url?: string;
  created_at: string;
}

export interface HospitalEmergencyContact {
  id: string;
  hospital_name: string;
  location: string;
  emergency_number: string;
  ambulance_number: string;
  blood_bank_number?: string;
}

export interface Specialist {
  id: string;
  name: string;
  specialization: string;
  hospital_name: string;
  location: string;
  contact_number: string;
  email: string;
  availability: string;
  experience_years: number;
  profile_image_url?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  qualifications: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  languages_spoken: string[];
  consultation_fee: number;
  next_available_slot?: string;
  rating?: number;
  total_reviews?: number;
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  description: string;
  preparation: string;
  duration: string;
  cost: number;
  locations: string[];
  required_fasting: boolean;
  report_time: string;
  recommended_for: string[];
}

export interface AppointmentRequest {
  id: string;
  patient_id: string;
  specialist_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  symptoms: string[];
  notes?: string;
  created_at: string;
}

export interface PatientPredictiveAnalysis {
  id: string;
  patient_id: string;
  analysis_date: string;
  vital_signs: {
    heart_rate: number;
    temperature: number;
    blood_pressure: {
      systolic: number;
      diastolic: number;
    };
    respiratory_rate: number;
    oxygen_saturation: number;
  };
  risk_factors: Array<{
    factor: string;
    severity: string;
    impact: number;
    description: string;
    contributing_factors: string[];
  }>;
  disease_predictions: Array<{
    condition: string;
    probability: number;
    key_indicators: string[];
  }>;
  lifestyle_impact: {
    diet: {
      score: number;
      factors: string[];
      recommendations: string[];
    };
    sleep: {
      score: number;
      factors: string[];
      recommendations: string[];
    };
    stress: {
      score: number;
      factors: string[];
      recommendations: string[];
    };
    exercise: {
      score: number;
      factors: string[];
      recommendations: string[];
    };
  };
  environmental_factors: {
    seasonal_effects: string[];
    air_quality_impact: number;
    geographical_risks: string[];
    weather_sensitivity: number;
  };
  medical_history_analysis: {
    genetic_factors: string[];
    chronic_conditions: string[];
    previous_conditions: string[];
    family_history_impact: string[];
  };
  recommendations: Array<{
    category: string;
    priority: string;
    recommendations: string[];
    timeline: string;
    expected_benefits: string[];
  }>;
  specialist_referrals: Array<{
    specialization: string;
    reason: string;
    priority: string;
  }>;
  suggested_treatments: {
    therapies: string[];
    medications: string[];
    preventive_care: string[];
    follow_up_schedule: string[];
  };
  analysis_version: string;
  confidence_score: number;
  last_updated: string;
  created_at: string;
  updated_at: string;
}