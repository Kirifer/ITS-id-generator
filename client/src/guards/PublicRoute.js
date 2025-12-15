import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { authCheckStore } from "../store/authStore";

const PublicRoute = ({ children }) => {
  const { authCheck, loading, success, message } = authCheckStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (success) {
    if (message?.role === "Admin") {
      return <Navigate to="/dashboard" replace />;
    }

    if (message?.role === "Approver") {
      return <Navigate to="/approver-dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PublicRoute;
