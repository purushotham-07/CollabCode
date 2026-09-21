import apiClient from './client';

export const fileApi = {
  getFiles: async (workspaceId) => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/files`);
    return response.data;
  },

  getFile: async (workspaceId, fileId) => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/files/${fileId}`);
    return response.data;
  },

  createFile: async (workspaceId, data) => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/files`, data);
    return response.data;
  },

  updateContent: async (workspaceId, fileId, content) => {
    const response = await apiClient.put(`/workspaces/${workspaceId}/files/${fileId}/content`, { content });
    return response.data;
  },

  renameFile: async (workspaceId, fileId, newPath) => {
    const response = await apiClient.patch(`/workspaces/${workspaceId}/files/${fileId}/rename`, { newPath });
    return response.data;
  },

  moveFile: async (workspaceId, fileId, destinationPath) => {
    const response = await apiClient.patch(`/workspaces/${workspaceId}/files/${fileId}/move`, { destinationPath });
    return response.data;
  },

  deleteFile: async (workspaceId, fileId) => {
    const response = await apiClient.delete(`/workspaces/${workspaceId}/files/${fileId}`);
    return response.data;
  },
};
