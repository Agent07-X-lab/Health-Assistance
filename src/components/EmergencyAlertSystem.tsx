import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, X, Phone, MapPin, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EmergencyAlert, Patient } from '../lib/types';

export default function EmergencyAlertSystem() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('active');

  useEffect(() => {
    fetchAlerts();
    const subscription = supabase
      .channel('emergency_alerts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergency_alerts' }, () => {
        fetchAlerts();
        if (soundEnabled) playAlertSound();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      let query = supabase
        .from('emergency_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const playAlertSound = () => {
    // In production, play actual alert sound
    console.log('🔔 Alert sound played');
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('emergency_alerts')
        .update({
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
        })
        .eq('id', alertId);

      if (error) throw error;
      fetchAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('emergency_alerts')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
        })
        .eq('id', alertId);

      if (error) throw error;
      fetchAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'High':
        return 'bg-orange-100 border-orange-500 text-orange-900';
      case 'Medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-900';
    }
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'Critical' || severity === 'High') {
      return <AlertTriangle className="w-6 h-6" />;
    }
    return <Bell className="w-6 h-6" />;
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalCount = activeAlerts.filter(a => a.severity === 'Critical').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${criticalCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-br from-teal-500 to-blue-600'}`}>
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Emergency Alert System</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeAlerts.length} Active Alerts • {criticalCount} Critical
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-3 rounded-lg ${soundEnabled ? 'bg-teal-100 text-teal-600' : 'bg-gray-200 text-gray-600'}`}
              >
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 mb-6 flex space-x-2">
          {['all', 'active', 'acknowledged', 'resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Alerts</h3>
              <p className="text-gray-600 dark:text-gray-400">All systems are operating normally.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 rounded-2xl shadow-xl p-6 ${getSeverityColor(alert.severity)} ${
                  alert.severity === 'Critical' && alert.status === 'active' ? 'animate-pulse' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={alert.severity === 'Critical' ? 'animate-bounce' : ''}>
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold">{alert.alert_type}</h3>
                        <span className="px-3 py-1 bg-white/50 rounded-full text-xs font-semibold">
                          {alert.severity}
                        </span>
                        <span className="px-3 py-1 bg-white/50 rounded-full text-xs font-semibold">
                          {alert.status}
                        </span>
                      </div>
                      <p className="text-sm mb-4">{alert.message}</p>
                      
                      {/* Vitals Snapshot */}
                      {alert.vitals_snapshot && (
                        <div className="bg-white/50 rounded-lg p-3 mb-4">
                          <h4 className="font-semibold text-sm mb-2">Vitals at Alert Time:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            {Object.entries(alert.vitals_snapshot).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(alert.created_at).toLocaleString()}</span>
                        </div>
                        {alert.acknowledged_at && (
                          <div className="flex items-center space-x-1 text-green-700">
                            <CheckCircle className="w-4 h-4" />
                            <span>Acknowledged {new Date(alert.acknowledged_at).toLocaleTimeString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {alert.status === 'active' && (
                      <>
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          Acknowledge
                        </button>
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          Resolve
                        </button>
                      </>
                    )}
                    {alert.status === 'acknowledged' && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
                      >
                        Resolve
                      </button>
                    )}
                    <a
                      href={`tel:911`}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium whitespace-nowrap flex items-center justify-center space-x-1"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call 911</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Emergency Contacts */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Emergency Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="tel:911"
              className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Phone className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-200">Emergency Services</p>
                <p className="text-sm text-red-700 dark:text-red-300">911</p>
              </div>
            </a>
            <a
              href="tel:1-800-HOSPITAL"
              className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-200">Hospital Hotline</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">1-800-HOSPITAL</p>
              </div>
            </a>
            <a
              href="tel:1-800-POISON"
              className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <Phone className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-200">Poison Control</p>
                <p className="text-sm text-green-700 dark:text-green-300">1-800-POISON</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
