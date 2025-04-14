import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { EnvironmentalData } from '../lib/types';

export default function EnvironmentalDataChart({ location }: { location: string }) {
  const [data, setData] = useState<EnvironmentalData[]>([]);

  useEffect(() => {
    fetchEnvironmentalData();
  }, [location]);

  async function fetchEnvironmentalData() {
    const { data, error } = await supabase
      .from('environmental_data')
      .select('*')
      .eq('location', location)
      .order('timestamp', { ascending: false })
      .limit(7);

    if (error) {
      console.error('Error fetching environmental data:', error);
      return;
    }

    setData(data || []);
  }

  const chartData = data.map(d => ({
    date: new Date(d.timestamp).toLocaleDateString(),
    'Air Quality': d.air_quality,
    'Water Quality': d.water_quality,
    'Pollution Level': d.pollution_level
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Environmental Data - {location}</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Air Quality" fill="#8884d8" />
            <Bar dataKey="Water Quality" fill="#82ca9d" />
            <Bar dataKey="Pollution Level" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}