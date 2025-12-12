import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './components/Login';
import Logout from './components/Logout';
import Admin_Dashboard from './components/Admin-Dashboard';
import Admin_IDGenerator from './components/Admin-IDGenerator';
import Admin_GeneratedIDs from './components/Admin-GeneratedIDs';
import Approver_Dashboard from './components/DashboardHR';
import Approver_GeneratedIDs from './components/ApprovalHR';
import IDViewer from './components/Login2';
import GeneratedID from './components/Viewing';

/* ---------- auth helpers ---------- */
function getToken() {
  return localStorage.getItem('token') || '';
}

function getRole() {
  return localStorage.getItem('role') || '';
}

/* ---------- route guards ---------- */
function RequireAuth({ children }) {
  return getToken()
    ? children
    : <Navigate to="/login" replace />;
}

function RequireRole({ role, children }) {
  const token = getToken();
  const userRole = getRole();

  if (!token) return <Navigate to="/login" replace />;
  if (userRole === role) return children;
  if (userRole === 'Admin') return <Navigate to="/dashboard" replace />;
  if (userRole === 'Approver') return <Navigate to="/approver-dashboard" replace />;

  return <Navigate to="/login" replace />;
}

function RedirectIfAuthed({ children }) {
  const token = getToken();
  const role = getRole();

  if (!token) return children;
  if (role === 'Admin') return <Navigate to="/dashboard" replace />;
  if (role === 'Approver') return <Navigate to="/approver-dashboard" replace />;

  return children;
}

/* ---------- app ---------- */
export default function App() {
  return (
    <Router>
      <div className="App min-h-screen custom-bg">
        <Routes>
          {/* Public */}
          <Route path="/login" element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/view-login" element={<IDViewer />} />
          <Route path="/view-generated-id/:idNumber" element={<GeneratedID />} />
          {/* Admin */}
          <Route path="/dashboard" element={<RequireRole role="Admin"><Admin_Dashboard /></RequireRole>} />
          <Route path="/id-generator" element={<RequireRole role="Admin"><Admin_IDGenerator /></RequireRole>} />
          <Route path="/generated-ids" element={<RequireRole role="Admin"><Admin_GeneratedIDs /></RequireRole>} />
          {/* Approver */}
          <Route path="/approver-dashboard" element={<RequireRole role="Approver"><Approver_Dashboard /></RequireRole>} />
          <Route path="/approver-generated-ids" element={<RequireRole role="Approver"><Approver_GeneratedIDs /></RequireRole>} />
          {/* Fallback */}
          <Route path="*" element={<RequireAuth><RoleLanding /></RequireAuth>} />
        </Routes>
      </div>
    </Router>
  );
}

/* ---------- role landing ---------- */
function RoleLanding() {
  const role = getRole();

  if (role === 'Admin') return <Navigate to="/dashboard" replace />;
  if (role === 'Approver') return <Navigate to="/approver-dashboard" replace />;

  return <Navigate to="/login" replace />;
}
