import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useFileStore } from '../store/fileStore';
import WorkspaceHeader from '../components/WorkspaceHeader';
import FileTree from '../components/FileTree';
import FileIcon from '../components/FileIcon';
import InviteModal from '../components/InviteModal';
import { X, Lock, FileCode, Check, Save } from 'lucide-react';

export default function WorkspaceView() {
  const { id: workspaceId } = useParams();
  const navigate = useNavigate();

  const {
    currentWorkspace,
    fetchWorkspace,
    updateMemberRole,
    removeMember,
    deleteWorkspace,
  } = useWorkspaceStore();

  const {
    files,
    activeFileId,
    openFileIds,
    fetchFiles,
    setActiveFile,
    closeFile,
    createFile,
    renameFile,
    deleteFile,
    updateContent,
  } = useFileStore();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace(workspaceId).catch(() => navigate('/dashboard'));
      fetchFiles(workspaceId);
    }
  }, [workspaceId, fetchWorkspace, fetchFiles, navigate]);

  const activeFile = files.find((f) => f.id === activeFileId);
  const myRole = currentWorkspace?.myRole || 'VIEWER';
  const canEdit = myRole === 'OWNER' || myRole === 'EDITOR';

  // Sync editor buffer when active file switches
  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content || '');
    }
  }, [activeFileId, activeFile]);

  const handleContentChange = (newVal) => {
    if (!canEdit) return;
    setEditorContent(newVal);
  };

  const handleManualSave = async () => {
    if (!activeFileId || !canEdit) return;
    setIsSaving(true);
    try {
      await updateContent(workspaceId, activeFileId, editorContent);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 1500);
    } catch (e) {
      alert('Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-surface-canvas overflow-hidden select-none">
      {/* Workspace Navigation & Collaborators Header */}
      <WorkspaceHeader
        workspace={currentWorkspace}
        myRole={myRole}
        onOpenInvite={() => setIsInviteOpen(true)}
        onDeleteWorkspace={async () => {
          await deleteWorkspace(workspaceId);
          navigate('/dashboard');
        }}
      />

      {/* Workspace Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: File Explorer Sidebar */}
        <FileTree
          files={files}
          activeFileId={activeFileId}
          onSelectFile={setActiveFile}
          onCreateFile={(req) => createFile(workspaceId, req)}
          onRenameFile={(fileId, newPath) => renameFile(workspaceId, fileId, newPath)}
          onDeleteFile={(fileId) => deleteFile(workspaceId, fileId)}
          canEdit={canEdit}
        />

        {/* Center: Editor Canvas */}
        <div className="flex-1 flex flex-col bg-surface-canvas overflow-hidden">
          {/* File Tabs Bar */}
          <div className="h-9 bg-surface-subtle border-b border-border-subtle flex items-center px-2 gap-1 overflow-x-auto">
            {openFileIds.map((fileId) => {
              const file = files.find((f) => f.id === fileId);
              if (!file) return null;
              const isActive = file.id === activeFileId;

              return (
                <div
                  key={file.id}
                  onClick={() => setActiveFile(file.id)}
                  className={`group flex items-center gap-2 px-3 py-1 rounded-t-sm text-xs font-mono border-t-2 cursor-pointer transition-colors duration-100 ${
                    isActive
                      ? 'bg-surface-canvas border-accent text-text-primary font-medium'
                      : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface-canvas/50'
                  }`}
                >
                  <FileIcon path={file.path} isDirectory={false} className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[140px]">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFile(file.id);
                    }}
                    className="p-0.5 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            {/* Read-Only Badge for Viewers */}
            {!canEdit && (
              <div className="ml-auto pr-3 flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                <Lock className="w-3.5 h-3.5" />
                <span>Read-only View</span>
              </div>
            )}

            {/* Save Button for Editors */}
            {canEdit && activeFile && (
              <div className="ml-auto pr-3 flex items-center gap-2">
                <button
                  onClick={handleManualSave}
                  disabled={isSaving}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-sm bg-surface-raised hover:bg-surface-overlay border border-border-default text-text-primary text-xs font-mono transition-colors duration-120"
                >
                  {savedFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-accent" />
                      <span className="text-accent">Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-text-muted" />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Active File Editor Container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeFile ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* File Path & Language Bar */}
                <div className="h-7 px-4 bg-surface-subtle/50 border-b border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-muted">
                  <span>{activeFile.path}</span>
                  <span className="uppercase text-[10px] text-accent bg-accent-subtle px-1.5 py-0.2 rounded-sm border border-accent-border">
                    {activeFile.language || 'plaintext'}
                  </span>
                </div>

                {/* Editor Surface */}
                <div className="flex-1 flex overflow-hidden font-mono text-xs">
                  <textarea
                    value={editorContent}
                    readOnly={!canEdit}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder={canEdit ? 'Type code here...' : 'Read-only document preview'}
                    className={`w-full h-full p-4 bg-surface-canvas text-text-primary font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-accent-subtle selection:text-accent-base ${
                      !canEdit ? 'cursor-default opacity-85' : ''
                    }`}
                    spellCheck={false}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-text-muted">
                <FileCode className="w-10 h-10 mb-2.5 text-text-muted opacity-40" />
                <p className="text-xs font-semibold text-text-secondary">No file selected</p>
                <p className="text-[11px] text-text-muted mt-1">
                  Choose a file from the explorer on the left or create a new file.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share / Invite & Members Modal */}
      <InviteModal
        workspace={currentWorkspace}
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        isOwner={myRole === 'OWNER'}
        onUpdateRole={(targetUserId, newRole) => updateMemberRole(workspaceId, targetUserId, newRole)}
        onRemoveMember={(targetUserId) => removeMember(workspaceId, targetUserId)}
      />
    </div>
  );
}
