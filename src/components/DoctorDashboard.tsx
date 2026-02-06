import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, Video, FileText, Activity, 
  Pill, Clock, TrendingUp, AlertCircle, Stethoscope 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function DoctorDashboard() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingConsultations: 0,
    prescriptionsIssued: 0,
  });

  useEffect(() => {
    if (session?.user) {
      loadDoctorData();
    }
  }, [session]);

  const loadDoctorData = async () => {
    try {
      const { data: doctor } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', session?.user?.id)
        .single();

      setDoctorData(doctor);

      // Load statistics (mock data for prototype)
      setStats({
        totalPatients: 45,
        todayAppointments: 8,
        pendingConsultations: 3,
        prescriptionsIssued: 127,
      });
    } catch (error) {
      console.error('Error loading doctor data:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/doctor-login');
  };

  const quickActions = [
    {
      title: 'View Patients',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/patients'),
    },
    {
      title: 'Appointments',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      action: () => navigate('/appointments'),
    },
    {
      title: 'Video Consultation',
      icon: Video,
      color: 'from-green-500 to-teal-500',
      action: () => navigate('/video-consultation'),
    },
    {
      title: 'Prescriptions',
      icon: Pill,
      color: 'from-orange-500 to-red-500',
      action: () => navigate('/prescriptions'),
    },
  ];

  const recentActivities = [
    { type: 'appointment', patient: 'John Doe', time: '10:00 AM', status: 'Completed' },
    { type: 'consultation', patient: 'Jane Smith', time: '11:30 AM', status: 'In Progress' },
    { type: 'prescription', patient: 'Mike Johnson', time: '2:00 PM', status: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Dr. {doctorData?.name || 'Doctor'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {doctorData?.specialization || 'Medical Professional'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.totalPatients}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 dark:text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.todayAppointments}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>3 pending</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Consultations</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.pendingConsultations}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-orange-600 dark:text-orange-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Pending review</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Prescriptions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.prescriptionsIssued}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <Activity className="w-4 h-4 mr-1" />
              <span>This month</span>
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

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {activity.patient}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} • {activity.time}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activity.status === 'Completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : activity.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
