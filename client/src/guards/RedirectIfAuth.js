import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authCheckStore } from '../store/authStore';
import { isAuthenticated, getRole } from '../utils/authUtils';

export default function RedirectIfAuthed({ children }) {
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
    if (!checking && authSuccess) {
      const role = getRole();
      if (role === 'Admin') {
        navigate('/dashboard', { replace: true });
      } else if (role === 'Approver') {
        navigate('/approver-dashboard', { replace: true });
      }
    }
  }, [checking, authSuccess, navigate]);

  if (checking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return !isAuthenticated() ? children : null;
}