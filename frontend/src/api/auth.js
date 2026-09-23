import apiClient from './client';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  refresh: async (refreshToken) => {
    const token = refreshToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('collabcode_refresh_token') : null);
    const response = await apiClient.post(
      '/auth/refresh',
      token ? { refreshToken: token } : {},
      {
        headers: token ? { 'X-Refresh-Token': token } : {},
      }
    );
    return response.data;
  },

  logout: async (refreshToken) => {
    const token = refreshToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('collabcode_refresh_token') : null);
    const response = await apiClient.post(
      '/auth/logout',
      token ? { refreshToken: token } : {},
      {
        headers: token ? { 'X-Refresh-Token': token } : {},
      }
    );
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  getGoogleAuthUrl: async (redirectUri) => {
    const response = await apiClient.get('/auth/oauth2/google/url', {
      params: { redirectUri },
    });
    return response.data;
  },

  googleCallback: async (code, redirectUri) => {
    const response = await apiClient.post('/auth/oauth2/google/callback', {
      code,
      redirectUri,
    });
    return response.data;
  },
};
