import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PatientPredictiveAnalysis } from '../lib/types';
import { AlertTriangle, Activity, Brain, FileText, Heart, Thermometer, Stethoscope, Calendar } from 'lucide-react';

interface Props {
  patientId: string;
}

export default function PatientPredictions({ patientId }: Props) {
  const [analysis, setAnalysis] = useState<PatientPredictiveAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictiveAnalysis();
  }, [patientId]);

  async function fetchPredictiveAnalysis() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patient_predictive_analysis')
        .select('*')
        .eq('patient_id', patientId)
        .order('analysis_date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setAnalysis(data);
    } catch (error) {
      console.error('Error fetching predictive analysis:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-8">
        <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Diagnostic Data Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No diagnostic analysis has been performed for this patient yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Diagnostic Report
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="inline-block w-4 h-4 mr-1" />
            Analysis Date: {new Date(analysis.analysis_date).toLocaleDateString()}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <div className="text-blue-600 dark:text-blue-300 text-sm font-medium">
              Analysis Version
            </div>
            <div className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              {analysis.analysis_version}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <div className="text-green-600 dark:text-green-300 text-sm font-medium">
              Confidence Score
            </div>
            <div className="text-lg font-semibold text-green-800 dark:text-green-200">
              {(analysis.confidence_score * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Disease Predictions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Disease Predictions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis.disease_predictions.map((disease, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <AlertTriangle
                    className={`w-5 h-5 mr-2 ${
                      disease.probability > 0.7
                        ? 'text-red-500'
                        : disease.probability > 0.4
                        ? 'text-yellow-500'
                        : 'text-green-500'
                    }`}
                  />
                  <h4 className="text-lg font-medium text-gray-800 dark:text-white">
                    {disease.condition}
                  </h4>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    disease.probability > 0.7
                      ? 'bg-red-100 text-red-800'
                      : disease.probability > 0.4
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {(disease.probability * 100).toFixed(1)}% Risk
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Indicators:
                  </h5>
                  <ul className="space-y-2">
                    {disease.key_indicators.map((indicator, i) => (
                      <li key={i} className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Medical History Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white mb-3">
              Chronic Conditions
            </h4>
            <ul className="space-y-2">
              {analysis.medical_history_analysis.chronic_conditions.map((condition, i) => (
                <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {condition}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white mb-3">
              Genetic Factors
            </h4>
            <ul className="space-y-2">
              {analysis.medical_history_analysis.genetic_factors.map((factor, i) => (
                <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Treatment Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Treatment Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white mb-3">
              Suggested Treatments
            </h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Therapies:
                </h5>
                <ul className="space-y-2">
                  {analysis.suggested_treatments.therapies.map((therapy, i) => (
                    <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      {therapy}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medications:
                </h5>
                <ul className="space-y-2">
                  {analysis.suggested_treatments.medications.map((medication, i) => (
                    <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      {medication}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white mb-3">
              Specialist Referrals
            </h4>
            <div className="space-y-4">
              {analysis.specialist_referrals.map((referral, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {referral.specialization}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        referral.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : referral.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {referral.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {referral.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Schedule */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Follow-up Schedule
        </h3>
        <div className="space-y-4">
          {analysis.suggested_treatments.follow_up_schedule.map((schedule, i) => (
            <div key={i} className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              {schedule}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}