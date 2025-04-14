import React from 'react';

export default function Facilities() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Our Facilities
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Emergency Department
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            24/7 emergency care with state-of-the-art equipment and experienced staff.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Diagnostic Center
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Advanced diagnostic equipment for accurate and timely test results.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Specialty Clinics
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Dedicated clinics for various medical specialties and treatments.
          </p>
        </div>
      </div>
    </div>
  );
}