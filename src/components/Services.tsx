import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Consultations from './services/Consultations';
import Diagnostics from './services/Diagnostics';
import Emergency from './services/Emergency';
import Lab from './services/Lab';

export default function Services() {
  return (
    <Routes>
      <Route path="consultations" element={<Consultations />} />
      <Route path="diagnostics" element={<Diagnostics />} />
      <Route path="emergency" element={<Emergency />} />
      <Route path="lab" element={<Lab />} />
    </Routes>
  );
}