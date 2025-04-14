import React, { useState, useEffect } from 'react';
import { FileText, Search, MapPin, Calendar, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LabTest } from '../lib/types';

export default function LabServices() {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabTests();
  }, []);

  async function fetchLabTests() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lab_tests')
        .select('*')
        .order('name');

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching lab tests:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || test.category === selectedCategory;
    const matchesLocation = !selectedLocation || test.locations.includes(selectedLocation);
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const categories = Array.from(new Set(tests.map(test => test.category)));
  const locations = Array.from(new Set(tests.flatMap(test => test.locations)));

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Laboratory Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="input"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading tests...</div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-300">
            No tests found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map(test => (
              <div key={test.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {test.name}
                  </h3>
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="font-medium">{test.cost.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {test.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Duration: {test.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Available at {test.locations.length} locations</span>
                  </div>
                  {test.required_fasting && (
                    <div className="flex items-center text-amber-600 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span>Fasting required</span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 mb-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                    Preparation Instructions
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {test.preparation}
                  </p>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <p><strong>Report Time:</strong> {test.report_time}</p>
                  <p><strong>Recommended for:</strong> {test.recommended_for.join(', ')}</p>
                </div>

                <button className="w-full btn-primary flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}