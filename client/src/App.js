import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./screens/Login";
import Logout from "./screens/Logout";
import Admin_Dashboard from "./screens/Admin-Dashboard";
import Admin_IDGenerator from "./screens/Admin-IDGenerator";
import Admin_GeneratedIDs from "./screens/Admin-GeneratedIDs";
import Approver_Dashboard from "./screens/DashboardHR";
import Approver_GeneratedIDs from "./screens/ApprovalHR";
import IDViewer from "./screens/Login2";
import GeneratedID from "./screens/Viewing";

import ProtectedRouting from "./guards/ProtectedRouting";
import { RoleLanding } from "./utils/roleLanding";
import PublicRoute from "./guards/PublicRoute";

export default function App() {
  return (
    <Router>
      <div className="App min-h-screen custom-bg">
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/view-login" element={<IDViewer />} />
          <Route path="/view-generated-id/:idNumber" element={<GeneratedID />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRouting role="Admin">
                <Admin_Dashboard />
              </ProtectedRouting>
            }
          />

          <Route
            path="/id-generator"
            element={
              <ProtectedRouting role="Admin">
                <Admin_IDGenerator />
              </ProtectedRouting>
            }
          />

          <Route
            path="/generated-ids"
            element={
              <ProtectedRouting role="Admin">
                <Admin_GeneratedIDs />
              </ProtectedRouting>
            }
          />

          <Route
            path="/approver-dashboard"
            element={
              <ProtectedRouting role="Approver">
                <Approver_Dashboard />
              </ProtectedRouting>
            }
          />

          <Route
            path="/approver-generated-ids"
            element={
              <ProtectedRouting role="Approver">
                <Approver_GeneratedIDs />
              </ProtectedRouting>
            }
          />

          <Route
            path="*"
            element={
              <ProtectedRouting>
                <RoleLanding />
              </ProtectedRouting>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
