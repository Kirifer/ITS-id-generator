import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'; 
import Dashboard from './components/Dashboard'; 
import IdGenerator from './components/IdGenerator';
import GeneratedIds from './components/GeneratedIds';

function App() {
  return (
    <Router>
      <div className="App min-h-screen custom-bg">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/id-generator" element={<IdGenerator />} />
          <Route path="/generated-ids" element={<GeneratedIds />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
