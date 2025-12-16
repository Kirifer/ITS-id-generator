import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./guards/ProtectedRouting";


import Login from "./screens/Login";
import Logout from "./screens/Logout";
import Admin_Dashboard from "./screens/Admin-Dashboard";
import Admin_IDGenerator from "./screens/Admin-IDGenerator";
import Admin_GeneratedIDs from "./screens/Admin-GeneratedIDs";
import Approver_Dashboard from "./screens/DashboardHR";
import Approver_GeneratedIDs from "./screens/ApprovalHR";
import IDViewer from "./screens/Login2";
import GeneratedID from "./screens/Viewing";
// import Unauthorized from "./screens/Unauthorized";

export default function App() {
  return (
    <Router>
      <div className="App min-h-screen custom-bg">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/view-login" element={<IDViewer />} />
          <Route path="/view-generated-id/:idNumber" element={<GeneratedID />} />
          {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

          {/* Admin-only routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Admin_Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/id-generator"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Admin_IDGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generated-ids"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Admin_GeneratedIDs />
              </ProtectedRoute>
            }
          />

          {/* Approver-only routes */}
          <Route
            path="/approver-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Approver"]}>
                <Approver_Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approver-generated-ids"
            element={
              <ProtectedRoute allowedRoles={["Approver"]}>
                <Approver_GeneratedIDs />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}