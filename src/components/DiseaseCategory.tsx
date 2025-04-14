import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Pill, AlertTriangle, DollarSign } from 'lucide-react';
import { PredictionResult } from '../lib/types';

interface DiseaseCategoryProps {
  category: {
    name: string;
    probability: number;
    specific_conditions: Array<{
      name: string;
      probability: number;
      medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        cost: number;
        side_effects: string[];
      }>;
    }>;
  };
}

export default function DiseaseCategory({ category }: DiseaseCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center">
          <AlertTriangle className={`w-5 h-5 mr-2 ${
            category.probability > 0.7 ? 'text-red-500' :
            category.probability > 0.4 ? 'text-yellow-500' :
            'text-green-500'
          }`} />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {category.name}
          </h3>
        </div>
        <div className="flex items-center">
          <span className="mr-4 text-sm font-medium text-gray-600 dark:text-gray-300">
            {(category.probability * 100).toFixed(1)}% Risk
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {category.specific_conditions.map((condition, index) => (
            <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-700 dark:text-gray-200">
                  {condition.name}
                </h4>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {(condition.probability * 100).toFixed(1)}%
                </span>
              </div>

              <div className="space-y-3">
                {condition.medications.map((medication, medIndex) => (
                  <div
                    key={medIndex}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Pill className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          {medication.name}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>{medication.cost.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Dosage: {medication.dosage}</p>
                      <p>Frequency: {medication.frequency}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Side effects: {medication.side_effects.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}