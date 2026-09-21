import apiClient from './client';

export const workspaceApi = {
  getWorkspaces: async () => {
    const response = await apiClient.get('/workspaces');
    return response.data;
  },

  getWorkspace: async (workspaceId) => {
    const response = await apiClient.get(`/workspaces/${workspaceId}`);
    return response.data;
  },

  createWorkspace: async (data) => {
    const response = await apiClient.post('/workspaces', data);
    return response.data;
  },

  updateMemberRole: async (workspaceId, targetUserId, role) => {
    const response = await apiClient.patch(`/workspaces/${workspaceId}/members/${targetUserId}`, { role });
    return response.data;
  },

  removeMember: async (workspaceId, targetUserId) => {
    const response = await apiClient.delete(`/workspaces/${workspaceId}/members/${targetUserId}`);
    return response.data;
  },

  deleteWorkspace: async (workspaceId) => {
    const response = await apiClient.delete(`/workspaces/${workspaceId}`);
    return response.data;
  },

  createInvite: async (workspaceId, data) => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/invites`, data);
    return response.data;
  },
};
