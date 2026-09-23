import { create } from 'zustand';
import { authApi } from '../api/auth';

const getInitialState = () => {
  if (typeof localStorage === 'undefined') {
    return { user: null, accessToken: null, isAuthenticated: false };
  }
  try {
    const savedUser = localStorage.getItem('collabcode_user');
    const savedAccessToken = localStorage.getItem('collabcode_access_token');
    const user = savedUser ? JSON.parse(savedUser) : null;
    return {
      user,
      accessToken: savedAccessToken,
      isAuthenticated: Boolean(user && savedAccessToken),
    };
  } catch (e) {
    return { user: null, accessToken: null, isAuthenticated: false };
  }
};

const initial = getInitialState();

export const useAuthStore = create((set, get) => ({
  user: initial.user,
  accessToken: initial.accessToken,
  isAuthenticated: initial.isAuthenticated,
  isLoading: true,

  setAuth: (user, accessToken, refreshToken = null) => {
    if (typeof localStorage !== 'undefined') {
      if (user) {
        localStorage.setItem('collabcode_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('collabcode_user');
      }

      if (accessToken) {
        localStorage.setItem('collabcode_access_token', accessToken);
      } else {
        localStorage.removeItem('collabcode_access_token');
      }

      if (refreshToken) {
        localStorage.setItem('collabcode_refresh_token', refreshToken);
      }
    }

    set({
      user,
      accessToken,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  setAccessToken: (accessToken) => {
    if (typeof localStorage !== 'undefined' && accessToken) {
      localStorage.setItem('collabcode_access_token', accessToken);
    }
    set({ accessToken });
  },

  logout: async () => {
    const storedRefreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('collabcode_refresh_token') : null;
    try {
      await authApi.logout(storedRefreshToken);
    } catch (e) {
      // Ignored - cleanup local state regardless
    } finally {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('collabcode_user');
        localStorage.removeItem('collabcode_access_token');
        localStorage.removeItem('collabcode_refresh_token');
      }
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  checkAuth: async () => {
    const storedRefreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('collabcode_refresh_token') : null;
    const storedAccessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('collabcode_access_token') : null;

    // If there is no session stored at all, we are simply logged out
    if (!storedRefreshToken && !storedAccessToken) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true });
    try {
      const data = await authApi.refresh(storedRefreshToken);
      get().setAuth(data.user, data.accessToken, data.refreshToken || storedRefreshToken);
    } catch (err) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('collabcode_user');
        localStorage.removeItem('collabcode_access_token');
        localStorage.removeItem('collabcode_refresh_token');
      }
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
