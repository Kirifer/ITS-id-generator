// screens/RoleLanding.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authCheckStore } from "../store/authCheckStore";

export default function RoleLanding() {
  const navigate = useNavigate();
  const { message } = authCheckStore();

  useEffect(() => {
    const role = message?.role;
    if (role === "Admin") {
      navigate("/dashboard");
    } else if (role === "Approver") {
      navigate("/approver-dashboard");
    } else {
      navigate("/login");
    }
  }, [message, navigate]);

  return <div>Redirecting...</div>;
}