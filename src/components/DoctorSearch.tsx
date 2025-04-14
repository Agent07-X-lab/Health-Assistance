import React, { useState, useEffect, useContext } from 'react';
import { Search, MapPin, Star, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Specialist } from '../lib/types';
import SpecialistConsultation from './SpecialistConsultation';
import { AuthContext } from '../contexts/AuthContext';

export default function DoctorSearch() {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchSpecialists();
  }, []);

  async function fetchSpecialists() {
    try {
      setLoading(true);
      let query = supabase.from('specialists').select('*');

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,specialization.ilike.%${searchTerm}%`);
      }
      if (selectedLocation) {
        query = query.eq('location', selectedLocation);
      }
      if (selectedSpecialization) {
        query = query.eq('specialization', selectedSpecialization);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSpecialists(data || []);
    } catch (error) {
      console.error('Error fetching specialists:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleBookClick = (specialist: Specialist) => {
    if (!user) {
      alert('Please log in to book an appointment');
      return;
    }
    setSelectedSpecialist(specialist);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Find a Doctor
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
            <option value="Kolkata">Kolkata</option>
          </select>
          <select
            className="input"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            <option value="">All Specializations</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Psychiatrist">Psychiatrist</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading doctors...</div>
      ) : specialists.length === 0 ? (
        <div className="text-center py-8">No doctors found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialists.map((specialist) => (
            <div key={specialist.id} className="card">
              <div className="flex items-center mb-4">
                <Link to={`/specialists/${specialist.id}`} className="block">
                  <img
                    src={specialist.profile_image_url || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300'}
                    alt={specialist.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                </Link>
                <div>
                  <Link 
                    to={`/specialists/${specialist.id}`}
                    className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {specialist.name}
                  </Link>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    {specialist.specialization}
                  </p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <Link 
                  to={`/hospitals/${encodeURIComponent(specialist.hospital_name)}`}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{specialist.hospital_name}, {specialist.location}</span>
                </Link>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  <span>{specialist.experience_years} years experience</span>
                </div>
              </div>
              <button
                onClick={() => handleBookClick(specialist)}
                className="w-full btn-primary"
              >
                <Calendar className="w-4 h-4 mr-2 inline-block" />
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedSpecialist && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <button
                onClick={() => setSelectedSpecialist(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
              <SpecialistConsultation
                specialist={selectedSpecialist}
                patientId={user.id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}