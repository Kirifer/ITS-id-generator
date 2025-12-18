import { Navigate } from "react-router-dom";
import { authCheckStore } from "../store/authStore";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { loading, success, message } = authCheckStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!success) {
    return <Navigate to="/login" replace />;
  }

  const userRole = message?.role;

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if (userRole === "Admin") return <Navigate to="/dashboard" replace />;
    if (userRole === "Approver")
      return <Navigate to="/approver-dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
