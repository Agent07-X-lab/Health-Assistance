import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Video, CheckCircle, X, Plus, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Appointment } from '../lib/types';

export default function AppointmentSystem() {
  const { session } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [filter, setFilter] = useState<'all' | 'booked' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    type: 'consultation' as 'consultation' | 'follow_up' | 'emergency' | 'video_call',
    symptoms: '',
    notes: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const createAppointment = async () => {
    if (!session?.user || !newAppointment.date || !newAppointment.time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase.from('appointments').insert({
        patient_id: session.user.id,
        doctor_id: '00000000-0000-0000-0000-000000000000', // Mock doctor ID
        appointment_date: newAppointment.date,
        appointment_time: newAppointment.time,
        appointment_type: newAppointment.type,
        symptoms: newAppointment.symptoms.split(',').map(s => s.trim()),
        notes: newAppointment.notes,
        status: 'booked',
      });

      if (error) throw error;
      
      setShowNewAppointment(false);
      setNewAppointment({
        date: '',
        time: '',
        type: 'consultation',
        symptoms: '',
        notes: '',
      });
      fetchAppointments();
      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to book appointment');
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video_call':
        return <Video className="w-5 h-5" />;
      case 'emergency':
        return <Clock className="w-5 h-5 text-red-600" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const upcomingAppointments = appointments.filter(
    a => new Date(a.appointment_date) >= new Date() && a.status !== 'cancelled' && a.status !== 'completed'
  );

  const todayAppointments = appointments.filter(
    a => new Date(a.appointment_date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-3 rounded-xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Appointment System</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {upcomingAppointments.length} Upcoming • {todayAppointments.length} Today
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewAppointment(true)}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all font-medium flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</h3>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{appointments.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</h3>
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{upcomingAppointments.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</h3>
              <CheckCircle className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{todayAppointments.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</h3>
              <CheckCircle className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {appointments.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 mb-6 flex space-x-2 overflow-x-auto">
          {['all', 'booked', 'confirmed', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === tab
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Appointments</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any appointments yet.</p>
              <button
                onClick={() => setShowNewAppointment(true)}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all font-medium"
              >
                Book Your First Appointment
              </button>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-xl">
                      {getTypeIcon(appointment.appointment_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {appointment.appointment_type.replace('_', ' ').toUpperCase()}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.appointment_time}</span>
                        </div>
                      </div>

                      {appointment.symptoms && appointment.symptoms.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Symptoms:</p>
                          <div className="flex flex-wrap gap-2">
                            {appointment.symptoms.map((symptom, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                              >
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {appointment.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <strong>Notes:</strong> {appointment.notes}
                        </p>
                      )}

                      {!appointment.reminder_sent && appointment.status === 'booked' && (
                        <div className="flex items-center space-x-2 text-xs text-yellow-600 dark:text-yellow-400">
                          <Clock className="w-4 h-4" />
                          <span>Reminder will be sent 24 hours before</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {appointment.status === 'booked' && (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {appointment.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          Complete
                        </button>
                        {appointment.appointment_type === 'video_call' && (
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium whitespace-nowrap flex items-center justify-center space-x-1">
                            <Video className="w-4 h-4" />
                            <span>Join Call</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* New Appointment Modal */}
        {showNewAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book New Appointment</h2>
                  <button
                    onClick={() => setShowNewAppointment(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Appointment Date *
                    </label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Appointment Time *
                    </label>
                    <input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Appointment Type *
                    </label>
                    <select
                      value={newAppointment.type}
                      onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="consultation">Consultation</option>
                      <option value="follow_up">Follow-up</option>
                      <option value="emergency">Emergency</option>
                      <option value="video_call">Video Call</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Symptoms (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newAppointment.symptoms}
                      onChange={(e) => setNewAppointment({ ...newAppointment, symptoms: e.target.value })}
                      placeholder="e.g., fever, headache, cough"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={newAppointment.notes}
                      onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Any additional information..."
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={createAppointment}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all font-medium"
                    >
                      Book Appointment
                    </button>
                    <button
                      onClick={() => setShowNewAppointment(false)}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
