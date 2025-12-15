// src/components/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../api/axios';

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    clearToken();                  // remove Authorization token
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  }, [navigate]);
  return null; // nothing to render
}
