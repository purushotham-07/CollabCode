import { create } from 'zustand';
import { authApi } from '../api/auth';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignored - cleanup local state regardless
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // Attempt silent refresh via httpOnly cookie
      const data = await authApi.refresh();
      set({
        user: data.user,
        accessToken: data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
