import { create } from 'zustand';
import { workspaceApi } from '../api/workspace';

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await workspaceApi.getWorkspaces();
      set({ workspaces: data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.detail || 'Failed to fetch workspaces',
        isLoading: false,
      });
    }
  },

  fetchWorkspace: async (workspaceId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await workspaceApi.getWorkspace(workspaceId);
      set({ currentWorkspace: data, isLoading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.detail || 'Failed to fetch workspace',
        isLoading: false,
      });
      throw err;
    }
  },

  createWorkspace: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const data = await workspaceApi.createWorkspace({ name });
      set((state) => ({
        workspaces: [data, ...state.workspaces],
        currentWorkspace: data,
        isLoading: false,
      }));
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.detail || 'Failed to create workspace',
        isLoading: false,
      });
      throw err;
    }
  },

  updateMemberRole: async (workspaceId, targetUserId, role) => {
    try {
      const updated = await workspaceApi.updateMemberRole(workspaceId, targetUserId, role);
      set({ currentWorkspace: updated });
      return updated;
    } catch (err) {
      throw err;
    }
  },

  removeMember: async (workspaceId, targetUserId) => {
    try {
      await workspaceApi.removeMember(workspaceId, targetUserId);
      set((state) => {
        if (!state.currentWorkspace) return state;
        return {
          currentWorkspace: {
            ...state.currentWorkspace,
            members: state.currentWorkspace.members.filter((m) => m.userId !== targetUserId),
          },
        };
      });
    } catch (err) {
      throw err;
    }
  },

  deleteWorkspace: async (workspaceId) => {
    try {
      await workspaceApi.deleteWorkspace(workspaceId);
      set((state) => ({
        workspaces: state.workspaces.filter((w) => w.id !== workspaceId),
        currentWorkspace: state.currentWorkspace?.id === workspaceId ? null : state.currentWorkspace,
      }));
    } catch (err) {
      throw err;
    }
  },
}));
