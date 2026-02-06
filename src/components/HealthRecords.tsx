import React, { useState } from 'react';
import { FileText, Upload, Download, Eye, Trash2, Plus, Calendar, User } from 'lucide-react';

interface HealthRecord {
  id: string;
  title: string;
  type: 'lab_report' | 'prescription' | 'scan' | 'vaccination' | 'other';
  date: string;
  doctor: string;
  notes: string;
  fileUrl?: string;
}

export default function HealthRecords() {
  const [records, setRecords] = useState<HealthRecord[]>([
    {
      id: '1',
      title: 'Blood Test Results',
      type: 'lab_report',
      date: '2024-01-15',
      doctor: 'Dr. Sarah Johnson',
      notes: 'Annual checkup - All values normal',
    },
    {
      id: '2',
      title: 'X-Ray Chest',
      type: 'scan',
      date: '2024-01-10',
      doctor: 'Dr. Michael Chen',
      notes: 'Routine examination - No abnormalities detected',
    },
    {
      id: '3',
      title: 'COVID-19 Vaccination',
      type: 'vaccination',
      date: '2023-12-20',
      doctor: 'Dr. Emily Brown',
      notes: 'Booster dose administered',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<HealthRecord>>({
    title: '',
    type: 'lab_report',
    date: new Date().toISOString().split('T')[0],
    doctor: '',
    notes: '',
  });

  const getTypeColor = (type: string) => {
    const colors = {
      lab_report: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      prescription: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      scan: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      vaccination: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lab_report':
        return <FileText className="w-5 h-5" />;
      case 'prescription':
        return <FileText className="w-5 h-5" />;
      case 'scan':
        return <Eye className="w-5 h-5" />;
      case 'vaccination':
        return <Plus className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const handleAddRecord = () => {
    if (newRecord.title && newRecord.doctor) {
      const record: HealthRecord = {
        id: Date.now().toString(),
        title: newRecord.title,
        type: newRecord.type as HealthRecord['type'],
        date: newRecord.date || new Date().toISOString().split('T')[0],
        doctor: newRecord.doctor,
        notes: newRecord.notes || '',
      };
      setRecords([record, ...records]);
      setShowAddModal(false);
      setNewRecord({
        title: '',
        type: 'lab_report',
        date: new Date().toISOString().split('T')[0],
        doctor: '',
        notes: '',
      });
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Health Records</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage and access your medical documents
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Record</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{records.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lab Reports</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {records.filter(r => r.type === 'lab_report').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Scans</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {records.filter(r => r.type === 'scan').length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vaccinations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {records.filter(r => r.type === 'vaccination').length}
                </p>
              </div>
              <Plus className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              All Records
            </h2>
            <div className="space-y-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-3 rounded-lg ${getTypeColor(record.type)}`}>
                        {getTypeIcon(record.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {record.title}
                        </h3>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <User className="w-4 h-4 mr-2" />
                            {record.doctor}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(record.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                        {record.notes && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Record Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Add New Record
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newRecord.title}
                    onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Blood Test Results"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newRecord.type}
                    onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as HealthRecord['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="lab_report">Lab Report</option>
                    <option value="prescription">Prescription</option>
                    <option value="scan">Scan</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Doctor
                  </label>
                  <input
                    type="text"
                    value={newRecord.doctor}
                    onChange={(e) => setNewRecord({ ...newRecord, doctor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Dr. John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRecord}
                  className="flex-1 btn-primary"
                >
                  Add Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
