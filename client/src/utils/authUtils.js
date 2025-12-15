import { authCheckStore } from '../store/authStore';
export function getAuthData() {
  const state = authCheckStore.getState();
  
  if (state.success && state.data) {
    return {
      isAuthenticated: true,
      role: state.data.role || '',
      userId: state.data.id || ''
    };
  }
  
  return {
    isAuthenticated: false,
    role: '',
    userId: ''
  };
}

export function isAuthenticated() {
  return getAuthData().isAuthenticated;
}

export function getRole() {
  return getAuthData().role;
}

export function getUserId() {
  return getAuthData().userId;
}

export function hasRole(role) {
  return getRole() === role;
}

export function clearAuth() {
  authCheckStore.setState({
    loading: false,
    success: false,
    error: false,
    message: '',
    data: null
  });
}