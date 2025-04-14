import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, Languages, MapPin, Phone, Mail, Award } from 'lucide-react';
import { Specialist } from '../lib/types';
import { supabase } from '../lib/supabase';

interface SpecialistConsultationProps {
  specialist: Specialist;
  patientId: string;
}

// Common symptoms list for autocompletion
const COMMON_SYMPTOMS = [
  'Fever',
  'Headache',
  'Cough',
  'Fatigue',
  'Body ache',
  'Nausea',
  'Dizziness',
  'Chest pain',
  'Shortness of breath',
  'Sore throat',
  'Runny nose',
  'Loss of appetite',
  'Joint pain',
  'Back pain',
  'Stomach pain',
  'Vomiting',
  'Diarrhea',
  'Constipation',
  'Skin rash',
  'Itching'
];

export default function SpecialistConsultation({ specialist, patientId }: SpecialistConsultationProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState<string>('');
  const [filteredSymptoms, setFilteredSymptoms] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string>('');
  const [showSymptomsList, setShowSymptomsList] = useState(false);

  useEffect(() => {
    if (symptomInput) {
      const filtered = COMMON_SYMPTOMS.filter(symptom =>
        symptom.toLowerCase().includes(symptomInput.toLowerCase())
      );
      setFilteredSymptoms(filtered);
      setShowSymptomsList(true);
    } else {
      setFilteredSymptoms([]);
      setShowSymptomsList(false);
    }
  }, [symptomInput]);

  const handleAddSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setSymptomInput('');
    setShowSymptomsList(false);
  };

  const handleRemoveSymptom = (symptomToRemove: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomToRemove));
  };

  const handleBookAppointment = async () => {
    try {
      if (!patientId) {
        throw new Error('Please log in to book an appointment');
      }

      setIsBooking(true);
      setBookingError('');

      const { data, error } = await supabase
        .from('appointment_requests')
        .insert({
          patient_id: patientId,
          specialist_id: specialist.id,
          requested_date: selectedDate,
          requested_time: selectedTime,
          symptoms: selectedSymptoms,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      alert('Appointment request submitted successfully!');
    } catch (error) {
      setBookingError('Failed to book appointment. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-start">
        <img
          src={specialist.profile_image_url || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300'}
          alt={specialist.name}
          className="w-24 h-24 rounded-lg object-cover mr-6"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {specialist.name}
          </h3>
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            {specialist.specialization}
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Award className="w-4 h-4 mr-2" />
              <span>{specialist.experience_years} years experience</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{specialist.hospital_name}, {specialist.location}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Languages className="w-4 h-4 mr-2" />
              <span>{specialist.languages_spoken.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-6">
        <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Book Consultation
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Symptoms
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedSymptoms.map((symptom) => (
              <span
                key={symptom}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {symptom}
                <button
                  onClick={() => handleRemoveSymptom(symptom)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={symptomInput}
            onChange={(e) => setSymptomInput(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type to search symptoms..."
          />
          {showSymptomsList && filteredSymptoms.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleAddSymptom(symptom)}
                >
                  {symptom}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <DollarSign className="w-5 h-5 mr-1" />
            <span className="text-lg font-semibold">
              {formatCurrency(specialist.consultation_fee || 0)} / hour
            </span>
          </div>
          <button
            onClick={handleBookAppointment}
            disabled={isBooking || !selectedDate || !selectedTime || selectedSymptoms.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isBooking ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>

        {bookingError && (
          <p className="text-red-500 text-sm">{bookingError}</p>
        )}

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Phone className="w-4 h-4 mr-2" />
            <span>{specialist.contact_number}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Mail className="w-4 h-4 mr-2" />
            <span>{specialist.email}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-2" />
            <span>{specialist.availability}</span>
          </div>
        </div>
      </div>
    </div>
  );
}