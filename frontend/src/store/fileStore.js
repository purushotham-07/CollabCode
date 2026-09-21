import { create } from 'zustand';
import { fileApi } from '../api/file';

export const useFileStore = create((set, get) => ({
  files: [],
  activeFileId: null,
  openFileIds: [],
  isLoading: false,
  error: null,

  fetchFiles: async (workspaceId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fileApi.getFiles(workspaceId);
      set({ files: data, isLoading: false });

      // If active file is not set or not in files, pick the first non-directory file
      const currentActive = get().activeFileId;
      const fileStillExists = data.some((f) => f.id === currentActive && !f.isDirectory);

      if (!fileStillExists) {
        const firstFile = data.find((f) => !f.isDirectory);
        if (firstFile) {
          set({
            activeFileId: firstFile.id,
            openFileIds: [firstFile.id],
          });
        } else {
          set({ activeFileId: null, openFileIds: [] });
        }
      }
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.detail || 'Failed to fetch files',
        isLoading: false,
      });
      throw err;
    }
  },

  setActiveFile: (fileId) => {
    const { openFileIds } = get();
    if (!openFileIds.includes(fileId)) {
      set({
        activeFileId: fileId,
        openFileIds: [...openFileIds, fileId],
      });
    } else {
      set({ activeFileId: fileId });
    }
  },

  closeFile: (fileId) => {
    const { activeFileId, openFileIds } = get();
    const newOpenIds = openFileIds.filter((id) => id !== fileId);
    let newActiveId = activeFileId;

    if (activeFileId === fileId) {
      newActiveId = newOpenIds.length > 0 ? newOpenIds[newOpenIds.length - 1] : null;
    }

    set({
      openFileIds: newOpenIds,
      activeFileId: newActiveId,
    });
  },

  createFile: async (workspaceId, { path, isDirectory, content }) => {
    try {
      const newFile = await fileApi.createFile(workspaceId, { path, isDirectory, content });
      // Refresh entire file list to capture any auto-created parent directories
      await get().fetchFiles(workspaceId);
      if (!isDirectory) {
        get().setActiveFile(newFile.id);
      }
      return newFile;
    } catch (err) {
      throw err;
    }
  },

  updateContent: async (workspaceId, fileId, content) => {
    try {
      const updated = await fileApi.updateContent(workspaceId, fileId, content);
      set((state) => ({
        files: state.files.map((f) => (f.id === fileId ? updated : f)),
      }));
      return updated;
    } catch (err) {
      throw err;
    }
  },

  renameFile: async (workspaceId, fileId, newPath) => {
    try {
      await fileApi.renameFile(workspaceId, fileId, newPath);
      await get().fetchFiles(workspaceId);
    } catch (err) {
      throw err;
    }
  },

  deleteFile: async (workspaceId, fileId) => {
    try {
      await fileApi.deleteFile(workspaceId, fileId);
      get().closeFile(fileId);
      await get().fetchFiles(workspaceId);
    } catch (err) {
      throw err;
    }
  },
}));
