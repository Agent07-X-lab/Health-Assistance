import React, { useState, useEffect } from 'react';
import { Watch, Heart, Activity, Moon, Flame, TrendingUp, AlertTriangle, MapPin } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { WearableData } from '../lib/types';

export default function WearableDeviceDashboard() {
  const { session } = useAuth();
  const [currentData, setCurrentData] = useState({
    steps: 8547,
    heartRate: 72,
    sleepHours: 7.5,
    caloriesBurned: 2340,
    distanceKm: 6.8,
    activeMinutes: 45,
  });
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    generateHistoricalData();
    startSimulation();
  }, []);

  const generateHistoricalData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        heartRate: 65 + Math.random() * 20,
        steps: Math.floor(Math.random() * 500),
        calories: Math.floor(50 + Math.random() * 100),
      });
    }
    
    setHistoricalData(data);
  };

  const startSimulation = () => {
    setIsSimulating(true);
    
    const interval = setInterval(() => {
      setCurrentData(prev => {
        const newHeartRate = Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 5));
        const newSteps = prev.steps + Math.floor(Math.random() * 50);
        const newCalories = prev.caloriesBurned + Math.floor(Math.random() * 10);
        const newDistance = prev.distanceKm + (Math.random() * 0.1);
        const newActiveMinutes = prev.activeMinutes + (Math.random() > 0.7 ? 1 : 0);

        // Check for abnormal heart rate
        const newAlerts = [];
        if (newHeartRate > 100) {
          newAlerts.push('⚠️ High heart rate detected: ' + Math.floor(newHeartRate) + ' bpm');
        } else if (newHeartRate < 50) {
          newAlerts.push('⚠️ Low heart rate detected: ' + Math.floor(newHeartRate) + ' bpm');
        }
        
        if (newAlerts.length > 0) {
          setAlerts(prev => [...newAlerts, ...prev].slice(0, 5));
        }

        return {
          steps: newSteps,
          heartRate: newHeartRate,
          sleepHours: prev.sleepHours,
          caloriesBurned: newCalories,
          distanceKm: newDistance,
          activeMinutes: newActiveMinutes,
        };
      });

      // Update historical data
      setHistoricalData(prev => {
        const newData = [...prev];
        newData.shift();
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          heartRate: currentData.heartRate,
          steps: Math.floor(Math.random() * 500),
          calories: Math.floor(50 + Math.random() * 100),
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  };

  const saveToDatabase = async () => {
    if (!session?.user) return;

    try {
      await supabase.from('wearable_data').insert({
        user_id: session.user.id,
        steps: currentData.steps,
        heart_rate: Math.floor(currentData.heartRate),
        sleep_hours: currentData.sleepHours,
        calories_burned: currentData.caloriesBurned,
        distance_km: currentData.distanceKm,
        active_minutes: currentData.activeMinutes,
        recorded_at: new Date().toISOString(),
      });
      alert('Wearable data saved successfully!');
    } catch (error) {
      console.error('Error saving wearable data:', error);
    }
  };

  const getStepsProgress = () => {
    const goal = 10000;
    return (currentData.steps / goal) * 100;
  };

  const getCaloriesProgress = () => {
    const goal = 2500;
    return (currentData.caloriesBurned / goal) * 100;
  };

  const getActiveMinutesProgress = () => {
    const goal = 60;
    return (currentData.activeMinutes / goal) * 100;
  };

  const sleepQuality = currentData.sleepHours >= 7 ? 'Good' : currentData.sleepHours >= 6 ? 'Fair' : 'Poor';
  const sleepColor = currentData.sleepHours >= 7 ? 'text-green-600' : currentData.sleepHours >= 6 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-3 rounded-xl">
                <Watch className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wearable Device Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Real-time Health Monitoring • Synced with Smartwatch</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">Health Alerts</h3>
                <div className="space-y-1">
                  {alerts.map((alert, index) => (
                    <p key={index} className="text-sm text-red-700 dark:text-red-300">{alert}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Steps */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Steps</h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {currentData.steps.toLocaleString()}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(getStepsProgress(), 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Goal: 10,000 steps</p>
          </div>

          {/* Heart Rate */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                  <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Heart Rate</h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {Math.floor(currentData.heartRate)} <span className="text-lg">bpm</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentData.heartRate < 60 ? 'Low' : currentData.heartRate > 100 ? 'High' : 'Normal'}
              </p>
            </div>
          </div>

          {/* Sleep */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                  <Moon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Sleep</h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {currentData.sleepHours.toFixed(1)} <span className="text-lg">hrs</span>
            </div>
            <p className={`text-sm font-semibold ${sleepColor}`}>
              Quality: {sleepQuality}
            </p>
          </div>

          {/* Calories */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                  <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Calories</h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {currentData.caloriesBurned.toLocaleString()}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(getCaloriesProgress(), 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Goal: 2,500 kcal</p>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Distance Traveled</h3>
              <MapPin className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {currentData.distanceKm.toFixed(2)} <span className="text-xl">km</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Today's journey</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Minutes</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {currentData.activeMinutes} <span className="text-xl">min</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(getActiveMinutesProgress(), 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Goal: 60 minutes</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Heart Rate Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Heart Rate Trend (24h)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[50, 120]} />
                <Tooltip />
                <Area type="monotone" dataKey="heartRate" stroke="#ef4444" fillOpacity={1} fill="url(#colorHeartRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Steps Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Steps per Hour</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="steps" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calories Burned Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Calories Burned (24h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="calories" stroke="#f97316" fillOpacity={1} fill="url(#colorCalories)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={saveToDatabase}
            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all font-medium shadow-lg"
          >
            Sync to Cloud
          </button>
          <button
            onClick={generateHistoricalData}
            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-medium"
          >
            Refresh Data
          </button>
        </div>

        {/* Device Info */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>ℹ️ Simulated Data:</strong> This dashboard displays mock smartwatch data for demonstration purposes. 
            In production, this would connect to real wearable devices via Bluetooth or cloud APIs.
          </p>
        </div>
      </div>
    </div>
  );
}
