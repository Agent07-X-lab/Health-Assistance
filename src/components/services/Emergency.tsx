import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Ambulance, ChevronFirst as FirstAid, AlertTriangle, MapPin, Clock, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EmergencyService {
  id: string;
  service_type: string;
  name: string;
  location: string;
  contact_numbers: {
    emergency: string;
    ambulance?: string;
    reception?: string;
    dispatch?: string;
    blood_bank?: string;
  };
  available_24x7: boolean;
  services_offered: string[];
}

export default function Emergency() {
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencyServices();
  }, []);

  async function fetchEmergencyServices() {
    try {
      setLoading(true);
      let query = supabase.from('emergency_services').select('*');
      
      if (selectedLocation) {
        query = query.eq('location', selectedLocation);
      }
      if (selectedType) {
        query = query.eq('service_type', selectedType);
      }

      const { data, error } = await query;
      if (error) throw error;

      setServices(data || []);

      // Get unique locations
      const uniqueLocations = Array.from(new Set(data?.map(service => service.location) || []));
      setLocations(uniqueLocations);
    } catch (error) {
      console.error('Error fetching emergency services:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmergencyServices();
  }, [selectedLocation, selectedType]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
          <h1 className="text-3xl font-bold text-red-700">
            Emergency Services
          </h1>
        </div>
        <p className="mt-2 text-red-600">
          For immediate medical emergencies, please call 102 or 108
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
        <select
          className="input"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Services</option>
          <option value="Hospital">Hospitals</option>
          <option value="Ambulance">Ambulance Services</option>
          <option value="Blood Bank">Blood Banks</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading emergency services...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-8">No emergency services found for the selected criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {service.name}
                </h3>
                {service.available_24x7 && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    24/7
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{service.location}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Heart className="w-4 h-4 mr-2" />
                  <span>{service.service_type}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {service.contact_numbers.emergency && (
                  <a
                    href={`tel:${service.contact_numbers.emergency}`}
                    className="flex items-center text-red-600 hover:text-red-800"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    <span>Emergency: {service.contact_numbers.emergency}</span>
                  </a>
                )}
                {service.contact_numbers.ambulance && (
                  <a
                    href={`tel:${service.contact_numbers.ambulance}`}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Ambulance className="w-4 h-4 mr-2" />
                    <span>Ambulance: {service.contact_numbers.ambulance}</span>
                  </a>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Services Offered:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {service.services_offered.map((s, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}