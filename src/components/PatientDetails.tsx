import React, { useEffect, useState } from 'react';
import { Patient, PatientPredictiveAnalysis } from '../lib/types';
import { Activity, AlertTriangle, FileText, Heart, Guitar as Hospital, Thermometer, Brain } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DiseaseDetails from './DiseaseDetails';
import LabServices from './LabServices';
import EmergencyContacts from './EmergencyContacts';
import PatientPredictions from './PatientPredictions';

interface Props {
  patient: Patient;
}

export default function PatientDetails({ patient }: Props) {
  const [predictiveAnalysis, setPredictiveAnalysis] = useState<PatientPredictiveAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'labs' | 'emergency'>('overview');

  useEffect(() => {
    if (patient) {
      fetchPredictiveAnalysis();
    }
  }, [patient]);

  async function fetchPredictiveAnalysis() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patient_predictive_analysis')
        .select('*')
        .eq('patient_id', patient.id)
        .order('analysis_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching predictive analysis:', error);
        return;
      }

      setPredictiveAnalysis(data);
    } catch (error) {
      console.error('Error in fetchPredictiveAnalysis:', error);
    } finally {
      setLoading(false);
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'predictions':
        return predictiveAnalysis ? (
          <PatientPredictions patientId={patient.id} />
        ) : (
          <div className="text-center py-8">No prediction data available</div>
        );
      case 'labs':
        return <LabServices />;
      case 'emergency':
        return <EmergencyContacts location={patient.location} />;
      default:
        return (
          <div className="space-y-6">
            {/* Patient Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={patient.profile_image_url || `https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&q=80&w=300`}
                  alt={patient.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{patient.name}</h2>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {patient.location}
                    </span>
                    <span className="flex items-center text-gray-600 dark:text-gray-300">
                      <Hospital className="w-4 h-4 mr-1" />
                      {patient.hospital_name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-gray-600 dark:text-gray-300">Age: {patient.age}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-300">Condition: {patient.condition}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Last Visit: {new Date(patient.last_visit).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Vital Signs</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Blood Pressure</p>
                      <p className="text-lg text-gray-800 dark:text-gray-100">
                        {patient.vital_signs.blood_pressure.systolic}/{patient.vital_signs.blood_pressure.diastolic}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Blood Sugar</p>
                      <p className="text-lg text-gray-800 dark:text-gray-100">
                        {patient.vital_signs.blood_sugar.fasting} mg/dL
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Heart Rate</p>
                      <p className="text-lg text-gray-800 dark:text-gray-100">
                        {patient.vital_signs.heart_rate} bpm
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Oxygen</p>
                      <p className="text-lg text-gray-800 dark:text-gray-100">
                        {patient.vital_signs.oxygen_saturation}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Medical History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Chronic Conditions</h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                    {patient.medical_history.chronic_conditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Family History</h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                    {patient.medical_history.family_history.map((history, index) => (
                      <li key={index}>{history}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Lifestyle Factors */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Lifestyle Factors</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Smoking Status</p>
                  <p className="text-gray-800 dark:text-gray-100">{patient.lifestyle_factors.smoking_status}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Alcohol Consumption</p>
                  <p className="text-gray-800 dark:text-gray-100">{patient.lifestyle_factors.alcohol_consumption}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Exercise Frequency</p>
                  <p className="text-gray-800 dark:text-gray-100">{patient.lifestyle_factors.exercise_frequency}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Diet Type</p>
                  <p className="text-gray-800 dark:text-gray-100">{patient.lifestyle_factors.diet_type}</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!patient) return null;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'predictions'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('predictions')}
        >
          Predictions
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'labs'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('labs')}
        >
          Lab Services
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'emergency'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('emergency')}
        >
          Emergency
        </button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}