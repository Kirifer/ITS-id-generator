import { Navigate } from "react-router-dom";
import { getRole } from "./authUtils"; 

export function RoleLanding() {
  const role = getRole();

  if (role === "Admin") return <Navigate to="/dashboard" replace />;
  if (role === "Approver") return <Navigate to="/approver-dashboard" replace />;

  return <Navigate to="/login" replace />;
}
