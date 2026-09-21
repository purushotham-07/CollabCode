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
    <div className="h-screen flex flex-col bg-[#0B0F17] overflow-hidden select-none">
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

      {/* Workspace Main Workspace Area */}
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
        <div className="flex-1 flex flex-col bg-[#0B0F17] overflow-hidden">
          {/* File Tabs Bar */}
          <div className="h-9 bg-[#0d1117] border-b border-slate-800 flex items-center px-2 gap-1 overflow-x-auto">
            {openFileIds.map((fileId) => {
              const file = files.find((f) => f.id === fileId);
              if (!file) return null;
              const isActive = file.id === activeFileId;

              return (
                <div
                  key={file.id}
                  onClick={() => setActiveFile(file.id)}
                  className={`group flex items-center gap-2 px-3 py-1 rounded-t-md text-xs font-mono border-t-2 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#0B0F17] border-brand-500 text-slate-100 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <FileIcon path={file.path} isDirectory={false} className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[140px]">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFile(file.id);
                    }}
                    className="p-0.5 rounded text-slate-500 hover:text-white hover:bg-slate-800/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            {/* Read-Only Badge for Viewers */}
            {!canEdit && (
              <div className="ml-auto pr-3 flex items-center gap-1.5 text-xs text-amber-400/90 font-mono">
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
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
                >
                  {savedFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-slate-400" />
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
                <div className="h-7 px-4 bg-slate-950/40 border-b border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{activeFile.path}</span>
                  <span className="uppercase text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    {activeFile.language || 'plaintext'}
                  </span>
                </div>

                {/* Editor Surface (Phase 2 functional textarea / preview with line numbers) */}
                <div className="flex-1 flex overflow-hidden font-mono text-xs">
                  <textarea
                    value={editorContent}
                    readOnly={!canEdit}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder={canEdit ? 'Type code here...' : 'Read-only document preview'}
                    className={`w-full h-full p-4 bg-[#0B0F17] text-slate-200 font-mono text-sm leading-relaxed resize-none focus:outline-none selection:bg-brand-500/30 ${
                      !canEdit ? 'cursor-default opacity-80' : ''
                    }`}
                    spellCheck={false}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <FileCode className="w-12 h-12 mb-3 text-slate-600" />
                <p className="text-sm font-semibold text-slate-400">No file selected</p>
                <p className="text-xs text-slate-500 mt-1">
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
