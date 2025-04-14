import React from 'react';
import { Activity, Brain } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center space-x-3 py-2">
      <div className="relative">
        <Activity className="h-10 w-10 text-primary-500" />
        <Brain className="h-6 w-6 text-secondary-500 absolute -bottom-1 -right-1" />
      </div>
      <div>
        <span className="text-2xl font-bold text-gray-800 dark:text-white block leading-none">
          HealthCare AI
        </span>
        <span className="text-sm text-primary-600 dark:text-primary-400">
          Advanced Care System
        </span>
      </div>
    </div>
  );
}