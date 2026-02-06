import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Heart, ArrowRight, Activity, Calendar, Pill, Video, Shield, Clock, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            AI-Powered Healthcare
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
              Management System
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Revolutionizing healthcare with artificial intelligence. Connect patients with doctors, 
            monitor health in real-time, and make data-driven medical decisions.
          </p>
        </div>

        {/* User Type Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* Doctor Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full mb-4">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                For Doctors
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage patients, prescribe medications, and conduct consultations
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Users className="w-5 h-5 text-teal-500" />
                <span>Patient Management Dashboard</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Video className="w-5 h-5 text-teal-500" />
                <span>Video Consultations</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Activity className="w-5 h-5 text-teal-500" />
                <span>AI-Powered Diagnostics</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Pill className="w-5 h-5 text-teal-500" />
                <span>E-Prescription System</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/doctor-login"
                className="block w-full py-3 px-6 text-center bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all font-medium shadow-lg"
              >
                Doctor Sign In
              </Link>
              <Link
                to="/doctor-signup"
                className="block w-full py-3 px-6 text-center border-2 border-teal-500 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-50 dark:hover:bg-gray-700 transition-all font-medium"
              >
                Register as Doctor
              </Link>
            </div>
          </div>

          {/* Patient Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                For Patients
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Track your health, book appointments, and consult with doctors
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Activity className="w-5 h-5 text-blue-500" />
                <span>AI Symptom Checker</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>Appointment Scheduling</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Pill className="w-5 h-5 text-blue-500" />
                <span>Medication Reminders</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Shield className="w-5 h-5 text-blue-500" />
                <span>Health Records Management</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/patient-login"
                className="block w-full py-3 px-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-lg"
              >
                Patient Sign In
              </Link>
              <Link
                to="/patient-signup"
                className="block w-full py-3 px-6 text-center border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all font-medium"
              >
                Register as Patient
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Our Platform?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-4">
                <Activity className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                AI-Powered Insights
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced machine learning algorithms for accurate health predictions and diagnostics
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                24/7 Availability
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Access healthcare services anytime, anywhere with our round-the-clock platform
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Private
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Your health data is encrypted and protected with industry-leading security standards
              </p>
            </div>
          </div>
        </div>

        {/* Legacy Login Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400">
            Looking for the general login?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-500 dark:text-teal-400 font-medium">
              Click here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
