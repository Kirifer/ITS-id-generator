import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authCheckStore } from "../store/authStore";

const PublicRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        await authCheckStore.getState().authCheck(); // just call it

        if (isMounted) {
          const state = authCheckStore.getState(); // read Zustand state
          setAuthData(state);
          setIsChecking(false);
        }
      } catch {
        if (isMounted) setIsChecking(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (authData?.success) {
    const userRole = authData.message.role;
    if (userRole === "Admin") return <Navigate to="/dashboard" replace />;
    if (userRole === "Approver")
      return <Navigate to="/approver-dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
