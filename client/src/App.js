import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { setupInterceptors, setNavigate } from "./api/axiosConfig";
import { authCheckStore } from "./store/authStore";
import ProtectedRoute from "./guards/ProtectedRouting";
import PublicRoute from "./guards/PublicRouter";
import Login from "./screens/Login";
import Logout from "./screens/Logout";
import Admin_Dashboard from "./screens/Admin-Dashboard";
import Admin_IDGenerator from "./screens/Admin-IDGenerator";
import Admin_GeneratedIDs from "./screens/Admin-GeneratedIDs";
import Approver_Dashboard from "./screens/DashboardHR";
import Approver_GeneratedIDs from "./screens/ApprovalHR";
import IDViewer from "./screens/Login2";
import GeneratedID from "./screens/Viewing";

function AppRoutes() {
  const authCheck = authCheckStore((state) => state.authCheck);
  const hasChecked = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
    setupInterceptors();
    if (!hasChecked.current) {
      const hasAccessToken = document.cookie.includes("accessToken");
      if (hasAccessToken) authCheck();
      hasChecked.current = true;
    }
  }, [navigate]);

  return (
    <div className="App min-h-screen custom-bg">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/view-login" element={<IDViewer />} />
        <Route path="/view-generated-id/:idNumber" element={<GeneratedID />} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["Admin"]}><Admin_Dashboard /></ProtectedRoute>} />
        <Route path="/id-generator" element={<ProtectedRoute allowedRoles={["Admin"]}><Admin_IDGenerator /></ProtectedRoute>} />
        <Route path="/generated-ids" element={<ProtectedRoute allowedRoles={["Admin"]}><Admin_GeneratedIDs /></ProtectedRoute>} />
        <Route path="/approver-dashboard" element={<ProtectedRoute allowedRoles={["Approver"]}><Approver_Dashboard /></ProtectedRoute>} />
        <Route path="/approver-generated-ids" element={<ProtectedRoute allowedRoles={["Approver"]}><Approver_GeneratedIDs /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
