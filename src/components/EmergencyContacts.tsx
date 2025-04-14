import React, { useEffect, useState } from 'react';
import { Phone, Ambulance, Droplet } from 'lucide-react';
import { HospitalEmergencyContact } from '../lib/types';
import { supabase } from '../lib/supabase';

export default function EmergencyContacts({ location }: { location: string }) {
  const [contacts, setContacts] = useState<HospitalEmergencyContact[]>([]);

  useEffect(() => {
    fetchEmergencyContacts();
  }, [location]);

  async function fetchEmergencyContacts() {
    const { data, error } = await supabase
      .from('hospital_emergency_contacts')
      .select('*')
      .eq('location', location);

    if (!error && data) {
      setContacts(data);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Emergency Contacts - {location}
      </h3>
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="border-l-4 border-red-500 pl-4 py-2"
          >
            <h4 className="font-medium text-gray-800 dark:text-white">
              {contact.hospital_name}
            </h4>
            <div className="mt-2 space-y-2">
              <a
                href={`tel:${contact.emergency_number}`}
                className="flex items-center text-red-600 dark:text-red-400"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span>Emergency: {contact.emergency_number}</span>
              </a>
              <a
                href={`tel:${contact.ambulance_number}`}
                className="flex items-center text-blue-600 dark:text-blue-400"
              >
                <Ambulance className="w-4 h-4 mr-2" />
                <span>Ambulance: {contact.ambulance_number}</span>
              </a>
              {contact.blood_bank_number && (
                <a
                  href={`tel:${contact.blood_bank_number}`}
                  className="flex items-center text-green-600 dark:text-green-400"
                >
                  <Droplet className="w-4 h-4 mr-2" />
                  <span>Blood Bank: {contact.blood_bank_number}</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}