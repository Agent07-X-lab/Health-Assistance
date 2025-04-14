import React from 'react';

export default function Diagnostics() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Diagnostic Services
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Comprehensive diagnostic services with state-of-the-art equipment.
        </p>
        <button className="btn-primary">
          Book Test
        </button>
      </div>
    </div>
  );
}