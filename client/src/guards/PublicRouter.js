import React from "react";
import { Navigate } from "react-router-dom";
import { authCheckStore } from "../store/authStore";

const PublicRoute = ({ children }) => {
  const { loading, success, message } = authCheckStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (success && message?.role) {
    const userRole = message.role;
    if (userRole === "Admin") return <Navigate to="/dashboard" replace />;
    if (userRole === "Approver") return <Navigate to="/approver-dashboard" replace />;
  }

  return children;
};

export default PublicRoute;