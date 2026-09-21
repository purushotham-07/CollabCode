import apiClient from './client';

export const inviteApi = {
  getInvite: async (token) => {
    const response = await apiClient.get(`/invites/${token}`);
    return response.data;
  },

  acceptInvite: async (token) => {
    const response = await apiClient.post(`/invites/${token}/accept`);
    return response.data;
  },
};
