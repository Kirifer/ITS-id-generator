import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'; 
import Dashboard from './components/Dashboard'; 
import DashboardHR from './components/DashboardHR';
import ApprovalHR from './components/ApprovalHR';

function App() {
  return (
    <Router>
      <div className="App min-h-screen custom-bg">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboardhr" element={<DashboardHR />} />
          <Route path="/approvalhr" element={<ApprovalHR />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
