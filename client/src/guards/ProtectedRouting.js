import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { authCheckStore } from "../store/authStore";
import { Loader } from "lucide-react";

const ProtectedRouting = ({ children, role }) => {
  const { authCheck, loading, success, error, message } = authCheckStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spinner"/>
      </div>
    );
  }

  if (error || !success) {
    return <Navigate to="/login" replace />;
  }

  if (role && message?.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRouting;
