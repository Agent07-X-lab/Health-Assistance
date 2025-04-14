import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, MapPin } from 'lucide-react';

export default function Lab() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Laboratory Services
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          to="/services/lab/tests"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all"
        >
          <FileText className="h-12 w-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Diagnostic Tests
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Browse our comprehensive range of diagnostic tests
          </p>
        </Link>
        
        <Link 
          to="/services/lab/locations"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all"
        >
          <MapPin className="h-12 w-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Lab Locations
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Find a laboratory near you
          </p>
        </Link>
        
        <Link 
          to="/services/lab/search"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all"
        >
          <Search className="h-12 w-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Search Tests
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Search for specific tests and packages
          </p>
        </Link>
      </div>
    </div>
  );
}