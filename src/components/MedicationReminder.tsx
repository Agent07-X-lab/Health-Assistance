import React, { useState, useEffect } from 'react';
import { Pill, Plus, Clock, CheckCircle, X, Bell, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MedicationReminder as MedicationReminderType } from '../lib/types';

export default function MedicationReminder() {
  const { session } = useAuth();
  const [medications, setMedications] = useState<MedicationReminderType[]>([]);
  const [showNewMedication, setShowNewMedication] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    timesPerDay: 1,
    reminderTimes: ['09:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: '',
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('medication_reminders')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  const addMedication = async () => {
    if (!session?.user || !newMedication.name || !newMedication.dosage) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase.from('medication_reminders').insert({
        patient_id: session.user.id,
        medication_name: newMedication.name,
        dosage: newMedication.dosage,
        frequency: newMedication.frequency,
        times_per_day: newMedication.timesPerDay,
        reminder_times: newMedication.reminderTimes,
        start_date: newMedication.startDate,
        end_date: newMedication.endDate || null,
        instructions: newMedication.instructions,
        status: 'active',
      });

      if (error) throw error;

      setShowNewMedication(false);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: 'daily',
        timesPerDay: 1,
        reminderTimes: ['09:00'],
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        instructions: '',
      });
      fetchMedications();
      alert('Medication reminder added successfully!');
    } catch (error) {
      console.error('Error adding medication:', error);
      alert('Failed to add medication reminder');
    }
  };

  const markAsTaken = async (medicationId: string, time: string) => {
    try {
      const medication = medications.find(m => m.id === medicationId);
      if (!medication) return;

      const newLog = [
        ...medication.taken_log,
        {
          date: new Date().toISOString().split('T')[0],
          time: time,
          taken: true,
          notes: '',
        },
      ];

      const { error } = await supabase
        .from('medication_reminders')
        .update({ taken_log: newLog })
        .eq('id', medicationId);

      if (error) throw error;
      fetchMedications();
    } catch (error) {
      console.error('Error marking medication as taken:', error);
    }
  };

  const markAsMissed = async (medicationId: string, time: string) => {
    try {
      const medication = medications.find(m => m.id === medicationId);
      if (!medication) return;

      const newLog = [
        ...medication.taken_log,
        {
          date: new Date().toISOString().split('T')[0],
          time: time,
          taken: false,
          notes: 'Missed',
        },
      ];

      const { error } = await supabase
        .from('medication_reminders')
        .update({ taken_log: newLog })
        .eq('id', medicationId);

      if (error) throw error;
      fetchMedications();
    } catch (error) {
      console.error('Error marking medication as missed:', error);
    }
  };

  const pauseMedication = async (medicationId: string) => {
    try {
      const { error } = await supabase
        .from('medication_reminders')
        .update({ status: 'paused' })
        .eq('id', medicationId);

      if (error) throw error;
      fetchMedications();
    } catch (error) {
      console.error('Error pausing medication:', error);
    }
  };

  const updateTimesPerDay = (count: number) => {
    const times = [];
    const intervals = 24 / count;
    for (let i = 0; i < count; i++) {
      const hour = Math.floor(9 + i * intervals);
      times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    setNewMedication({ ...newMedication, timesPerDay: count, reminderTimes: times });
  };

  const isTakenToday = (medication: MedicationReminderType, time: string) => {
    const today = new Date().toISOString().split('T')[0];
    return medication.taken_log.some(
      log => log.date === today && log.time === time && log.taken
    );
  };

  const getAdherenceRate = (medication: MedicationReminderType) => {
    if (medication.taken_log.length === 0) return 0;
    const taken = medication.taken_log.filter(log => log.taken).length;
    return Math.round((taken / medication.taken_log.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-3 rounded-xl">
                <Pill className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medication Reminders</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {medications.length} Active Medications • Never miss a dose
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewMedication(true)}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all font-medium flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Medication</span>
            </button>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Clock className="w-6 h-6 text-teal-600" />
            <span>Today's Schedule</span>
          </h2>
          <div className="space-y-3">
            {medications.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No medications scheduled for today
              </p>
            ) : (
              medications.map((medication) =>
                medication.reminder_times.map((time, idx) => (
                  <div
                    key={`${medication.id}-${idx}`}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                      isTakenToday(medication, time)
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        isTakenToday(medication, time)
                          ? 'bg-green-200 dark:bg-green-800'
                          : 'bg-blue-200 dark:bg-blue-800'
                      }`}>
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{medication.medication_name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {medication.dosage} • {time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isTakenToday(medication, time) ? (
                        <span className="flex items-center space-x-1 text-green-700 dark:text-green-300 font-medium">
                          <CheckCircle className="w-5 h-5" />
                          <span>Taken</span>
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => markAsTaken(medication.id, time)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Mark as Taken
                          </button>
                          <button
                            onClick={() => markAsMissed(medication.id, time)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Missed
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* All Medications */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All Medications</h2>
          <div className="space-y-4">
            {medications.length === 0 ? (
              <div className="text-center py-12">
                <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Medications Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Add your first medication to start tracking
                </p>
                <button
                  onClick={() => setShowNewMedication(true)}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all font-medium"
                >
                  Add Medication
                </button>
              </div>
            ) : (
              medications.map((medication) => (
                <div
                  key={medication.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {medication.medication_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {medication.dosage} • {medication.frequency}
                      </p>
                      {medication.instructions && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <strong>Instructions:</strong> {medication.instructions}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(medication.start_date).toLocaleDateString()} -{' '}
                            {medication.end_date ? new Date(medication.end_date).toLocaleDateString() : 'Ongoing'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Bell className="w-4 h-4" />
                          <span>{medication.times_per_day}x daily</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => pauseMedication(medication.id)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      Pause
                    </button>
                  </div>

                  {/* Reminder Times */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reminder Times:</p>
                    <div className="flex flex-wrap gap-2">
                      {medication.reminder_times.map((time, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full text-sm font-medium"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Adherence Rate */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Adherence Rate</p>
                      <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                        {getAdherenceRate(medication)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          getAdherenceRate(medication) >= 80
                            ? 'bg-green-500'
                            : getAdherenceRate(medication) >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${getAdherenceRate(medication)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* New Medication Modal */}
        {showNewMedication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Medication</h2>
                  <button
                    onClick={() => setShowNewMedication(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Medication Name *
                    </label>
                    <input
                      type="text"
                      value={newMedication.name}
                      onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                      placeholder="e.g., Aspirin"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      value={newMedication.dosage}
                      onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                      placeholder="e.g., 100mg"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frequency
                    </label>
                    <select
                      value={newMedication.frequency}
                      onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="twice_daily">Twice Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="as_needed">As Needed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Times Per Day: {newMedication.timesPerDay}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      value={newMedication.timesPerDay}
                      onChange={(e) => updateTimesPerDay(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newMedication.reminderTimes.map((time, idx) => (
                        <input
                          key={idx}
                          type="time"
                          value={time}
                          onChange={(e) => {
                            const newTimes = [...newMedication.reminderTimes];
                            newTimes[idx] = e.target.value;
                            setNewMedication({ ...newMedication, reminderTimes: newTimes });
                          }}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={newMedication.startDate}
                        onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={newMedication.endDate}
                        onChange={(e) => setNewMedication({ ...newMedication, endDate: e.target.value })}
                        min={newMedication.startDate}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instructions
                    </label>
                    <textarea
                      value={newMedication.instructions}
                      onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                      rows={3}
                      placeholder="e.g., Take with food"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={addMedication}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all font-medium"
                    >
                      Add Medication
                    </button>
                    <button
                      onClick={() => setShowNewMedication(false)}
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
