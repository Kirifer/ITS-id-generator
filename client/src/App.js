import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Logout from './components/Logout';
import Admin_Dashboard from './components/Admin-Dashboard';
import Admin_IDGenerator from './components/Admin-IDGenerator';
import Admin_GeneratedIDs from './components/Admin-GeneratedIDs';
import Approver_Dashboard from './components/DashboardHR';
import Approver_GeneratedIDs from './components/ApprovalHR';
import IDViewer from './components/Login2';
import GeneratedID from './components/Viewing';

/* ---------- tiny auth helpers ---------- */
function getToken() {
  return localStorage.getItem('token') || '';
}
function getRole() {
  return localStorage.getItem('role') || '';
}

/* Require any logged-in user */
function RequireAuth({ children }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

/* Require a specific role (single) */
function RequireRole({ role, children }) {
  const token = getToken();
  const userRole = getRole();
  if (!token) return <Navigate to="/login" replace />;
  if (userRole !== role) {
    // Bounce to the user’s own dashboard if they’re logged in but wrong role
    if (userRole === 'Admin') return <Navigate to="/dashboard" replace />;
    if (userRole === 'Approver') return <Navigate to="/approver-dashboard" replace />;
    return <Navigate to="/login" replace />;
  }
  return children;
}

/* Optional: keep logged-in users out of the /login page */
function RedirectIfAuthed({ children }) {
  const token = getToken();
  const role = getRole();
  if (token) {
    if (role === 'Admin') return <Navigate to="/dashboard" replace />;
    if (role === 'Approver') return <Navigate to="/approver-dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <div className="App min-h-screen custom-bg">
        <Routes>
          {/* Public */}
          <Route
            path="/login"
            element={
              <RedirectIfAuthed>
                <Login />
              </RedirectIfAuthed>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route path="/view-login" element={<IDViewer />} />
          <Route path="/view-generated-id/:idNumber" element={<GeneratedID/>} />

          {/* Admin-only */}
          <Route
            path="/dashboard"
            element={
              <RequireRole role="Admin">
                <Admin_Dashboard />
              </RequireRole>
            }
          />
          <Route
            path="/id-generator"
            element={
              <RequireRole role="Admin">
                <Admin_IDGenerator />
              </RequireRole>
            }
          />
          <Route
            path="/generated-ids"
            element={
              <RequireRole role="Admin">
                <Admin_GeneratedIDs />
              </RequireRole>
            }
          />

          {/* Approver-only */}
          <Route
            path="/approver-dashboard"
            element={
              <RequireRole role="Approver">
                <Approver_Dashboard />
              </RequireRole>
            }
          />
          <Route
            path="/approver-generated-ids"
            element={
              <RequireRole role="Approver">
                <Approver_GeneratedIDs />
              </RequireRole>
            }
          />

          {/* Catch-all: if authed, send to own dashboard; else login */}
          <Route
            path="*"
            element={
              <RequireAuth>
                <RoleLanding />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

/* Sends an authed user to the correct home when they hit a random route */
function RoleLanding() {
  const role = getRole();
  if (role === 'Admin') return <Navigate to="/dashboard" replace />;
  if (role === 'Approver') return <Navigate to="/approver-dashboard" replace />;
  return <Navigate to="/login" replace />;
}
