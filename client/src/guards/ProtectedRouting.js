import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authCheckStore } from "../store/authStore";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [authData, setAuthData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // console.log("ProtectedRoute: Starting auth check");
      try {
        await authCheckStore.getState().authCheck();

        if (isMounted) {
          const state = authCheckStore.getState();
          // console.log("ProtectedRoute: Auth state", state);
          // console.log("ProtectedRoute: User role", state.message?.role);
          // console.log("ProtectedRoute: Allowed roles", allowedRoles);
          setAuthData(state);
          setIsChecking(false);
        }
      } catch (error) {
        // console.error("ProtectedRoute: Auth check error", error);
        if (isMounted) {
          setIsChecking(false);
        }
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

  // console.log("ProtectedRoute: Auth success?", authData?.success);

  if (!authData?.success) {
    // console.log("ProtectedRoute: Redirecting to login - not authenticated");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = authData.message?.role;
  // console.log(
  //   "ProtectedRoute: Checking role access - user:",
  //   userRole,
  //   "allowed:",
  //   allowedRoles
  // );

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // console.log("ProtectedRoute: Role not allowed, redirecting");
    if (userRole === "Admin") {
      // console.log("Redirecting to /dashboard");
      return <Navigate to="/dashboard" replace />;
    } else if (userRole === "Approver") {
      // console.log("Redirecting to /approver-dashboard");
      return <Navigate to="/approver-dashboard" replace />;
    }
    // console.log("Redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // console.log("ProtectedRoute: Access granted");
  return children;
};

export default ProtectedRoute;
