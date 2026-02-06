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

// New Advanced Feature Types

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface SymptomCheckerMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SymptomCheckerHistory {
  id: string;
  user_id: string;
  symptoms: string[];
  predicted_conditions: Array<{
    name: string;
    probability: number;
    description: string;
  }>;
  urgency_level: 'Low' | 'Medium' | 'High';
  chat_history: SymptomCheckerMessage[];
  created_at: string;
}

export interface HealthRiskScore {
  id: string;
  patient_id: string;
  heart_disease_risk: number;
  diabetes_risk: number;
  hypertension_risk: number;
  overall_risk_score: number;
  vitals_data: {
    blood_pressure: { systolic: number; diastolic: number };
    blood_sugar: number;
    bmi: number;
    heart_rate: number;
    age: number;
    cholesterol?: number;
  };
  calculated_at: string;
  created_at: string;
}

export interface WearableData {
  id: string;
  user_id: string;
  steps: number;
  heart_rate: number;
  sleep_hours: number;
  calories_burned: number;
  distance_km: number;
  active_minutes: number;
  recorded_at: string;
  created_at: string;
}

export interface EmergencyAlert {
  id: string;
  patient_id: string;
  alert_type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  vitals_snapshot: any;
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  created_at: string;
}

export interface EHRRecord {
  id: string;
  patient_id: string;
  record_type: 'diagnosis' | 'lab_report' | 'prescription' | 'procedure' | 'note';
  title: string;
  description?: string;
  diagnosis?: string;
  doctor_id?: string;
  document_url?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface AIPrescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  diagnosis: string;
  suggested_medicines: Array<{
    name: string;
    generic_name: string;
    dosage: string;
    frequency: string;
    duration: string;
    cost_range: string;
  }>;
  drug_interactions?: Array<{
    drug1: string;
    drug2: string;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
  }>;
  dosage_recommendations: any;
  notes?: string;
  status: 'draft' | 'finalized' | 'dispensed';
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: 'booked' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  appointment_type: 'consultation' | 'follow_up' | 'emergency' | 'video_call';
  symptoms?: string[];
  notes?: string;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface VideoConsultation {
  id: string;
  appointment_id: string;
  session_id: string;
  patient_id: string;
  doctor_id: string;
  started_at?: string;
  ended_at?: string;
  duration_minutes?: number;
  prescription_notes?: string;
  chat_transcript?: Array<{
    sender: string;
    message: string;
    timestamp: string;
  }>;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface DietPlan {
  id: string;
  patient_id: string;
  plan_name: string;
  target_condition?: string;
  daily_calories: number;
  meal_plan: {
    [day: string]: {
      breakfast: { items: string[]; calories: number };
      lunch: { items: string[]; calories: number };
      dinner: { items: string[]; calories: number };
      snacks: { items: string[]; calories: number };
    };
  };
  dietary_restrictions: string[];
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityPlan {
  id: string;
  patient_id: string;
  plan_name: string;
  activity_type: string;
  exercises: Array<{
    name: string;
    description: string;
    duration_minutes: number;
    sets?: number;
    reps?: number;
    calories_burned: number;
  }>;
  frequency_per_week: number;
  duration_minutes: number;
  intensity_level: 'low' | 'moderate' | 'high';
  start_date: string;
  end_date?: string;
  completion_tracking: Array<{
    date: string;
    completed: boolean;
    notes?: string;
  }>;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface MedicationReminder {
  id: string;
  patient_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  times_per_day: number;
  reminder_times: string[];
  start_date: string;
  end_date?: string;
  instructions?: string;
  taken_log: Array<{
    date: string;
    time: string;
    taken: boolean;
    notes?: string;
  }>;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface EnvironmentalHealthData {
  id: string;
  location: string;
  air_quality_index: number;
  pollution_level: string;
  temperature?: number;
  humidity?: number;
  pollen_count?: number;
  uv_index?: number;
  health_advisories: string[];
  high_risk_conditions: string[];
  recorded_at: string;
  created_at: string;
}

export interface HealthTrend {
  id: string;
  patient_id: string;
  metric_type: string;
  metric_value: number;
  unit: string;
  is_abnormal: boolean;
  recorded_at: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  language: string;
  accessibility_mode: boolean;
  high_contrast: boolean;
  large_text: boolean;
  notification_preferences: any;
  created_at: string;
  updated_at: string;
}