import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Calendar, Activity, Pill, FileText, 
  Video, AlertTriangle, TrendingUp, Clock, User 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function PatientDashboard() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<any>(null);
  const [healthStats, setHealthStats] = useState({
    upcomingAppointments: 0,
    activeMedications: 0,
    healthScore: 0,
    lastCheckup: '',
  });

  useEffect(() => {
    if (session?.user) {
      loadPatientData();
    }
  }, [session]);

  const loadPatientData = async () => {
    try {
      const { data: patient } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', session?.user?.id)
        .single();

      setPatientData(patient);

      // Load health statistics (mock data for prototype)
      setHealthStats({
        upcomingAppointments: 2,
        activeMedications: 3,
        healthScore: 85,
        lastCheckup: '2 weeks ago',
      });
    } catch (error) {
      console.error('Error loading patient data:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/patient-login');
  };

  const quickActions = [
    {
      title: 'Book Appointment',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/appointments'),
    },
    {
      title: 'AI Symptom Checker',
      icon: Activity,
      color: 'from-purple-500 to-pink-500',
      action: () => navigate('/ai-symptom-checker'),
    },
    {
      title: 'Medications',
      icon: Pill,
      color: 'from-green-500 to-teal-500',
      action: () => navigate('/medications'),
    },
    {
      title: 'Video Consultation',
      icon: Video,
      color: 'from-orange-500 to-red-500',
      action: () => navigate('/video-consultation'),
    },
  ];

  const upcomingAppointments = [
    { doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'Tomorrow', time: '10:00 AM' },
    { doctor: 'Dr. Michael Chen', specialty: 'General Physician', date: 'Feb 10', time: '2:30 PM' },
  ];

  const medications = [
    { name: 'Aspirin', dosage: '100mg', frequency: 'Once daily', time: '9:00 AM' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', time: '8:00 AM, 8:00 PM' },
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', time: '9:00 AM' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome, {patientData?.name || 'Patient'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Your Health Dashboard
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Health Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Health Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {healthStats.healthScore}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 dark:text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Good health status</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Appointments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {healthStats.upcomingAppointments}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>Upcoming</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Medications</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {healthStats.activeMedications}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span>Active prescriptions</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Last Checkup</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {healthStats.lastCheckup}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <User className="w-4 h-4 mr-1" />
              <span>Dr. Sarah Johnson</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {action.title}
                </h3>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Upcoming Appointments
            </h2>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {appointment.doctor}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {appointment.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {appointment.date}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {appointment.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Medications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Active Medications
            </h2>
            <div className="space-y-4">
              {medications.map((medication, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {medication.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {medication.dosage} • {medication.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {medication.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
