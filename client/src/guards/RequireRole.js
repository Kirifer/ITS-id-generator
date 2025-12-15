import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authCheckStore } from '../store/authStore';
import { getRole } from '../utils/authUtils';

export default function RequireRole({ role, children }) {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const authCheck = authCheckStore((state) => state.authCheck);
  const authSuccess = authCheckStore((state) => state.success);

  useEffect(() => {
    const checkAuth = async () => {
      await authCheck();
      setChecking(false);
    };
    checkAuth();
  }, [authCheck]);

  useEffect(() => {
    if (!checking) {
      if (!authSuccess) {
        navigate('/login', { replace: true });
        return;
      }

      const userRole = getRole();
      
      if (userRole !== role) {
        if (userRole === 'Admin') {
          navigate('/dashboard', { replace: true });
        } else if (userRole === 'Approver') {
          navigate('/approver-dashboard', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      }
    }
  }, [checking, authSuccess, role, navigate]);

  if (checking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return getRole() === role ? children : null;
}