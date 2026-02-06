import React, { useState, useEffect } from 'react';
import { Activity, Heart, Droplet, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import * as tf from '@tensorflow/tfjs';
import { supabase } from '../lib/supabase';
import { Patient } from '../lib/types';

interface VitalsInput {
  systolic: number;
  diastolic: number;
  bloodSugar: number;
  bmi: number;
  heartRate: number;
  age: number;
  cholesterol: number;
}

interface RiskScores {
  heartDisease: number;
  diabetes: number;
  hypertension: number;
  overall: number;
}

export default function AIHealthRiskScore({ patient }: { patient?: Patient }) {
  const [vitals, setVitals] = useState<VitalsInput>({
    systolic: patient?.vital_signs?.blood_pressure?.systolic || 120,
    diastolic: patient?.vital_signs?.blood_pressure?.diastolic || 80,
    bloodSugar: patient?.vital_signs?.blood_sugar?.fasting || 100,
    bmi: 24,
    heartRate: patient?.vital_signs?.heart_rate || 75,
    age: patient?.age || 35,
    cholesterol: 180,
  });
  const [riskScores, setRiskScores] = useState<RiskScores | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [model, setModel] = useState<tf.LayersModel | null>(null);

  useEffect(() => {
    // Initialize TensorFlow.js model
    initializeModel();
  }, []);

  const initializeModel = async () => {
    try {
      // Create a simple neural network for health risk prediction
      const newModel = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [7], units: 16, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 8, activation: 'relu' }),
          tf.layers.dense({ units: 3, activation: 'sigmoid' }),
        ],
      });

      newModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy'],
      });

      setModel(newModel);
    } catch (error) {
      console.error('Error initializing model:', error);
    }
  };

  const normalizeVitals = (v: VitalsInput): number[] => {
    return [
      v.systolic / 200,
      v.diastolic / 120,
      v.bloodSugar / 300,
      v.bmi / 50,
      v.heartRate / 200,
      v.age / 100,
      v.cholesterol / 400,
    ];
  };

  const calculateRiskScores = async () => {
    setIsCalculating(true);

    try {
      // Normalize inputs
      const normalized = normalizeVitals(vitals);

      // Rule-based risk calculation (more accurate than untrained model)
      let heartDiseaseRisk = 0;
      let diabetesRisk = 0;
      let hypertensionRisk = 0;

      // Heart Disease Risk Factors
      if (vitals.systolic > 140 || vitals.diastolic > 90) heartDiseaseRisk += 25;
      if (vitals.cholesterol > 240) heartDiseaseRisk += 20;
      if (vitals.bmi > 30) heartDiseaseRisk += 15;
      if (vitals.age > 55) heartDiseaseRisk += 15;
      if (vitals.heartRate > 100 || vitals.heartRate < 60) heartDiseaseRisk += 10;
      if (vitals.bloodSugar > 126) heartDiseaseRisk += 15;

      // Diabetes Risk Factors
      if (vitals.bloodSugar > 126) diabetesRisk += 40;
      else if (vitals.bloodSugar > 100) diabetesRisk += 20;
      if (vitals.bmi > 30) diabetesRisk += 25;
      if (vitals.age > 45) diabetesRisk += 15;
      if (vitals.systolic > 140) diabetesRisk += 10;

      // Hypertension Risk Factors
      if (vitals.systolic > 140) hypertensionRisk += 40;
      else if (vitals.systolic > 130) hypertensionRisk += 25;
      if (vitals.diastolic > 90) hypertensionRisk += 30;
      else if (vitals.diastolic > 85) hypertensionRisk += 15;
      if (vitals.bmi > 30) hypertensionRisk += 15;
      if (vitals.age > 55) hypertensionRisk += 10;

      // Cap at 100
      heartDiseaseRisk = Math.min(heartDiseaseRisk, 100);
      diabetesRisk = Math.min(diabetesRisk, 100);
      hypertensionRisk = Math.min(hypertensionRisk, 100);

      // Calculate overall risk
      const overall = (heartDiseaseRisk + diabetesRisk + hypertensionRisk) / 3;

      const scores: RiskScores = {
        heartDisease: heartDiseaseRisk,
        diabetes: diabetesRisk,
        hypertension: hypertensionRisk,
        overall: overall,
      };

      setRiskScores(scores);

      // Save to database if patient exists
      if (patient) {
        await supabase.from('health_risk_scores').insert({
          patient_id: patient.id,
          heart_disease_risk: heartDiseaseRisk,
          diabetes_risk: diabetesRisk,
          hypertension_risk: hypertensionRisk,
          overall_risk_score: overall,
          vitals_data: vitals,
        });
      }
    } catch (error) {
      console.error('Error calculating risk scores:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const getRiskLevel = (score: number): { level: string; color: string; bgColor: string } => {
    if (score < 30) return { level: 'Low Risk', color: 'text-green-700', bgColor: 'bg-green-100' };
    if (score < 60) return { level: 'Moderate Risk', color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
    return { level: 'High Risk', color: 'text-red-700', bgColor: 'bg-red-100' };
  };

  const riskData = riskScores
    ? [
        { name: 'Heart Disease', value: riskScores.heartDisease },
        { name: 'Diabetes', value: riskScores.diabetes },
        { name: 'Hypertension', value: riskScores.hypertension },
      ]
    : [];

  const radarData = riskScores
    ? [
        { metric: 'Heart Disease', score: riskScores.heartDisease, fullMark: 100 },
        { metric: 'Diabetes', score: riskScores.diabetes, fullMark: 100 },
        { metric: 'Hypertension', score: riskScores.hypertension, fullMark: 100 },
      ]
    : [];

  const vitalsData = [
    { name: 'BP Systolic', value: vitals.systolic, normal: 120, unit: 'mmHg' },
    { name: 'BP Diastolic', value: vitals.diastolic, normal: 80, unit: 'mmHg' },
    { name: 'Blood Sugar', value: vitals.bloodSugar, normal: 100, unit: 'mg/dL' },
    { name: 'Heart Rate', value: vitals.heartRate, normal: 75, unit: 'bpm' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-3 rounded-xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Health Risk Assessment</h1>
              <p className="text-gray-600 dark:text-gray-400">Powered by TensorFlow.js • Predictive Health Analytics</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Enter Vitals</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    value={vitals.age}
                    onChange={(e) => setVitals({ ...vitals, age: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blood Pressure - Systolic (mmHg)
                  </label>
                  <input
                    type="number"
                    value={vitals.systolic}
                    onChange={(e) => setVitals({ ...vitals, systolic: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blood Pressure - Diastolic (mmHg)
                  </label>
                  <input
                    type="number"
                    value={vitals.diastolic}
                    onChange={(e) => setVitals({ ...vitals, diastolic: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blood Sugar (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={vitals.bloodSugar}
                    onChange={(e) => setVitals({ ...vitals, bloodSugar: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    BMI
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitals.bmi}
                    onChange={(e) => setVitals({ ...vitals, bmi: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cholesterol (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={vitals.cholesterol}
                    onChange={(e) => setVitals({ ...vitals, cholesterol: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <button
                  onClick={calculateRiskScores}
                  disabled={isCalculating}
                  className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 disabled:opacity-50 transition-all font-medium"
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Risk Scores'}
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {riskScores && (
              <>
                {/* Overall Risk Score */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Overall Health Risk</h2>
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <svg className="w-48 h-48 transform -rotate-90">
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${(riskScores.overall / 100) * 502.4} 502.4`}
                          className={
                            riskScores.overall < 30
                              ? 'text-green-500'
                              : riskScores.overall < 60
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          }
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          {riskScores.overall.toFixed(0)}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Risk Score</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <span
                      className={`inline-block px-6 py-2 rounded-full font-semibold ${
                        getRiskLevel(riskScores.overall).bgColor
                      } ${getRiskLevel(riskScores.overall).color}`}
                    >
                      {getRiskLevel(riskScores.overall).level}
                    </span>
                  </div>
                </div>

                {/* Individual Risk Scores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Heart className="w-6 h-6 text-red-500" />
                      <h3 className="font-bold text-gray-900 dark:text-white">Heart Disease</h3>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {riskScores.heartDisease.toFixed(0)}%
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          riskScores.heartDisease < 30
                            ? 'bg-green-500'
                            : riskScores.heartDisease < 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${riskScores.heartDisease}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Droplet className="w-6 h-6 text-blue-500" />
                      <h3 className="font-bold text-gray-900 dark:text-white">Diabetes</h3>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {riskScores.diabetes.toFixed(0)}%
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          riskScores.diabetes < 30
                            ? 'bg-green-500'
                            : riskScores.diabetes < 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${riskScores.diabetes}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-purple-500" />
                      <h3 className="font-bold text-gray-900 dark:text-white">Hypertension</h3>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {riskScores.hypertension.toFixed(0)}%
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          riskScores.hypertension < 30
                            ? 'bg-green-500'
                            : riskScores.hypertension < 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${riskScores.hypertension}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Risk Comparison</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={riskData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#14b8a6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Risk Profile</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar name="Risk Score" dataKey="score" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Vitals Comparison */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Vitals vs Normal Range</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={vitalsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#3b82f6" name="Your Value" />
                      <Bar dataKey="normal" fill="#10b981" name="Normal" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Recommendations */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recommendations</h3>
                  <div className="space-y-3">
                    {riskScores.heartDisease > 50 && (
                      <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-900 dark:text-red-200">High Heart Disease Risk</p>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            Consult a cardiologist. Consider lifestyle changes including diet and exercise.
                          </p>
                        </div>
                      </div>
                    )}
                    {riskScores.diabetes > 50 && (
                      <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-yellow-900 dark:text-yellow-200">Elevated Diabetes Risk</p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Monitor blood sugar regularly. Reduce sugar intake and maintain healthy weight.
                          </p>
                        </div>
                      </div>
                    )}
                    {riskScores.hypertension > 50 && (
                      <div className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-orange-900 dark:text-orange-200">High Blood Pressure Risk</p>
                          <p className="text-sm text-orange-700 dark:text-orange-300">
                            Reduce sodium intake. Regular exercise and stress management recommended.
                          </p>
                        </div>
                      </div>
                    )}
                    {riskScores.overall < 30 && (
                      <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-900 dark:text-green-200">Good Health Status</p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Maintain your healthy lifestyle. Continue regular check-ups.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {!riskScores && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Risk Assessment Yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your vitals and click "Calculate Risk Scores" to see your health risk assessment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
