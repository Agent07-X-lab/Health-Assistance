import React from 'react';
import { AlertTriangle, Pill, FileText, Activity, Brain, DollarSign } from 'lucide-react';
import { Disease } from '../lib/types';

interface DiseaseDetailsProps {
  disease: Disease;
}

export default function DiseaseDetails({ disease }: DiseaseDetailsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <AlertTriangle className={`w-6 h-6 mr-3 ${
            disease.probability > 0.7 ? 'text-red-500' :
            disease.probability > 0.4 ? 'text-yellow-500' :
            'text-green-500'
          }`} />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {disease.name}
          </h2>
        </div>
        <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {(disease.probability * 100).toFixed(1)}% Probability
        </span>
      </div>

      {/* Symptoms */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-500" />
          Symptoms
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {disease.symptoms.map((symptom, index) => (
            <div key={index} className="flex items-center text-gray-600 dark:text-gray-300">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {symptom}
            </div>
          ))}
        </div>
      </div>

      {/* Remedies */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-green-500" />
          Recommended Remedies
        </h3>
        <div className="space-y-4">
          {disease.remedies.map((remedy, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                {remedy.type}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {remedy.description}
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p><strong>Instructions:</strong> {remedy.instructions}</p>
                <p><strong>Duration:</strong> {remedy.duration}</p>
                <div className="mt-2">
                  <span className="text-sm font-medium">Effectiveness:</span>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${remedy.effectiveness * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medications */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
          <Pill className="w-5 h-5 mr-2 text-purple-500" />
          Recommended Medications
        </h3>
        <div className="space-y-4">
          {disease.medications.map((medication, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800 dark:text-white">
                  {medication.name}
                </h4>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="font-medium">{medication.cost.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <p><strong>Dosage:</strong> {medication.dosage}</p>
                <p><strong>Frequency:</strong> {medication.frequency}</p>
                <p><strong>Duration:</strong> {medication.duration}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Side Effects:</strong> {medication.side_effects.join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Tests */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-red-500" />
          Recommended Tests
        </h3>
        <div className="space-y-4">
          {disease.tests.map((test, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800 dark:text-white">
                  {test.name}
                </h4>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="font-medium">{test.cost.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {test.purpose}
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p><strong>Preparation:</strong> {test.preparation}</p>
                <p><strong>Duration:</strong> {test.duration}</p>
              </div>
              <button className="mt-4 w-full btn-primary flex items-center justify-center">
                Book Test
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}