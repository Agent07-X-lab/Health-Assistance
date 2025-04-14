import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PatientList from './PatientList';
import PatientDetails from './PatientDetails';
import EnvironmentalData from './EnvironmentalData';
import { Patient } from '../lib/types';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const { signOut } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              AI Patient Monitoring System
            </h1>
            <button
              onClick={() => signOut()}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <PatientList onSelectPatient={setSelectedPatient} />
          </div>
          <div className="space-y-8">
            {selectedPatient && (
              <>
                <PatientDetails patient={selectedPatient} />
                <EnvironmentalData location={selectedPatient.location} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}