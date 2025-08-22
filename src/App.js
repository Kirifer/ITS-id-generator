import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'; 
import Admin_Dashboard from './components/Admin-Dashboard'; 
import Admin_IDGenerator from './components/Admin-IDGenerator';
import Admin_GeneratedIDs from './components/Admin-GeneratedIDs';
import Approver_Dashboard from './components/Approver-Dashboard';
import Approver_GeneratedIDs from './components/Approver-GeneratedIDs';

function App() {
  return (
    <Router>
      <div className="App min-h-screen custom-bg">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Admin_Dashboard />} />
          <Route path="/id-generator" element={<Admin_IDGenerator />} />
          <Route path="/generated-ids" element={<Admin_GeneratedIDs />} />

          <Route path="/approver-dashboard" element={<Approver_Dashboard />} />
          <Route path="/approver-generated-ids" element={<Approver_GeneratedIDs />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;