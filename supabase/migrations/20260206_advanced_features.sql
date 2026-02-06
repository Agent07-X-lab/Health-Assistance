-- Advanced AI Healthcare Features Migration

-- User Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- AI Symptom Checker History
CREATE TABLE IF NOT EXISTS symptom_checker_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  symptoms TEXT[] NOT NULL,
  predicted_conditions JSONB NOT NULL,
  urgency_level TEXT NOT NULL CHECK (urgency_level IN ('Low', 'Medium', 'High')),
  chat_history JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Health Risk Scores
CREATE TABLE IF NOT EXISTS health_risk_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  heart_disease_risk DECIMAL(5,2) NOT NULL,
  diabetes_risk DECIMAL(5,2) NOT NULL,
  hypertension_risk DECIMAL(5,2) NOT NULL,
  overall_risk_score DECIMAL(5,2) NOT NULL,
  vitals_data JSONB NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wearable Device Data
CREATE TABLE IF NOT EXISTS wearable_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  steps INTEGER NOT NULL DEFAULT 0,
  heart_rate INTEGER NOT NULL,
  sleep_hours DECIMAL(4,2) NOT NULL,
  calories_burned INTEGER DEFAULT 0,
  distance_km DECIMAL(6,2) DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Alerts
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  vitals_snapshot JSONB NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Electronic Health Records (EHR)
CREATE TABLE IF NOT EXISTS ehr_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL CHECK (record_type IN ('diagnosis', 'lab_report', 'prescription', 'procedure', 'note')),
  title TEXT NOT NULL,
  description TEXT,
  diagnosis TEXT,
  doctor_id UUID REFERENCES auth.users(id),
  document_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Prescription Assistant
CREATE TABLE IF NOT EXISTS ai_prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  diagnosis TEXT NOT NULL,
  suggested_medicines JSONB NOT NULL,
  drug_interactions JSONB,
  dosage_recommendations JSONB NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'dispensed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Smart Appointment System
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'confirmed', 'cancelled', 'completed', 'no_show')),
  appointment_type TEXT NOT NULL CHECK (appointment_type IN ('consultation', 'follow_up', 'emergency', 'video_call')),
  symptoms TEXT[],
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video Consultation Sessions
CREATE TABLE IF NOT EXISTS video_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  prescription_notes TEXT,
  chat_transcript JSONB,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Diet Plans
CREATE TABLE IF NOT EXISTS diet_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  target_condition TEXT,
  daily_calories INTEGER NOT NULL,
  meal_plan JSONB NOT NULL,
  dietary_restrictions TEXT[],
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Recommendations
CREATE TABLE IF NOT EXISTS activity_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  exercises JSONB NOT NULL,
  frequency_per_week INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  intensity_level TEXT NOT NULL CHECK (intensity_level IN ('low', 'moderate', 'high')),
  start_date DATE NOT NULL,
  end_date DATE,
  completion_tracking JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medication Reminders
CREATE TABLE IF NOT EXISTS medication_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  times_per_day INTEGER NOT NULL,
  reminder_times TIME[] NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  instructions TEXT,
  taken_log JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Environmental Health Impact
CREATE TABLE IF NOT EXISTS environmental_health_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location TEXT NOT NULL,
  air_quality_index INTEGER NOT NULL,
  pollution_level TEXT NOT NULL,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  pollen_count INTEGER,
  uv_index INTEGER,
  health_advisories TEXT[],
  high_risk_conditions TEXT[],
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health Trend Analytics
CREATE TABLE IF NOT EXISTS health_trends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  is_abnormal BOOLEAN DEFAULT FALSE,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Language Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT NOT NULL DEFAULT 'en',
  accessibility_mode BOOLEAN DEFAULT FALSE,
  high_contrast BOOLEAN DEFAULT FALSE,
  large_text BOOLEAN DEFAULT FALSE,
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_symptom_checker_user ON symptom_checker_history(user_id);
CREATE INDEX idx_health_risk_patient ON health_risk_scores(patient_id);
CREATE INDEX idx_wearable_user ON wearable_data(user_id);
CREATE INDEX idx_emergency_alerts_patient ON emergency_alerts(patient_id);
CREATE INDEX idx_emergency_alerts_status ON emergency_alerts(status);
CREATE INDEX idx_ehr_patient ON ehr_records(patient_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_diet_plans_patient ON diet_plans(patient_id);
CREATE INDEX idx_activity_plans_patient ON activity_plans(patient_id);
CREATE INDEX idx_medication_reminders_patient ON medication_reminders(patient_id);
CREATE INDEX idx_health_trends_patient ON health_trends(patient_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Row Level Security Policies

-- User Roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own role" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Symptom Checker History
ALTER TABLE symptom_checker_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own symptom history" ON symptom_checker_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own symptom history" ON symptom_checker_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Health Risk Scores
ALTER TABLE health_risk_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view their own risk scores" ON health_risk_scores FOR SELECT USING (
  EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can view patient risk scores" ON health_risk_scores FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'doctor')
);

-- Wearable Data
ALTER TABLE wearable_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own wearable data" ON wearable_data FOR ALL USING (auth.uid() = user_id);

-- Emergency Alerts
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors can view all emergency alerts" ON emergency_alerts FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('doctor', 'admin'))
);
CREATE POLICY "Patients can view their own alerts" ON emergency_alerts FOR SELECT USING (
  EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can update alerts" ON emergency_alerts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('doctor', 'admin'))
);

-- EHR Records
ALTER TABLE ehr_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view their own EHR" ON ehr_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can view and manage EHR" ON ehr_records FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('doctor', 'admin'))
);

-- AI Prescriptions
ALTER TABLE ai_prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view their prescriptions" ON ai_prescriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can manage prescriptions" ON ai_prescriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'doctor')
);

-- Appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view their appointments" ON appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can view their appointments" ON appointments FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Patients can create appointments" ON appointments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can manage appointments" ON appointments FOR ALL USING (auth.uid() = doctor_id);

-- Video Consultations
ALTER TABLE video_consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view consultations" ON video_consultations FOR SELECT USING (
  auth.uid() = doctor_id OR EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND user_id = auth.uid())
);

-- Diet Plans
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view their diet plans" ON diet_plans FOR SELECT USING (
  EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can manage diet plans" ON diet_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('doctor', 'admin'))
);

-- Activity Plans
ALTER TABLE activity_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view their activity plans" ON activity_plans FOR SELECT USING (
  EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Patients can update their activity tracking" ON activity_plans FOR UPDATE USING (
  EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND user_id = auth.uid())
);

-- Medication Reminders
ALTER TABLE medication_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can manage their medication reminders" ON medication_reminders FOR ALL USING (
  EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND user_id = auth.uid())
);

-- Environmental Health Data
ALTER TABLE environmental_health_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view environmental data" ON environmental_health_data FOR SELECT TO authenticated USING (true);

-- Health Trends
ALTER TABLE health_trends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view their health trends" ON health_trends FOR SELECT USING (
  EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can view patient health trends" ON health_trends FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'doctor')
);

-- Audit Logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- User Preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
