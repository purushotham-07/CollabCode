import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, accessToken, isAuthenticated, isLoading, setAuth, logout, checkAuth } = useAuthStore();

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    setAuth,
    logout,
    checkAuth,
  };
};
