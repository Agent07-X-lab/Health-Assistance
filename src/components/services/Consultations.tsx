import React from 'react';

export default function Consultations() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Online Consultations
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Connect with our healthcare professionals from the comfort of your home.
        </p>
        <button className="btn-primary">
          Schedule Consultation
        </button>
      </div>
    </div>
  );
}