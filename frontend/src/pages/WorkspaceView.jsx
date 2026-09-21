import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useFileStore } from '../store/fileStore';
import WorkspaceHeader from '../components/WorkspaceHeader';
import FileTree from '../components/FileTree';
import FileIcon from '../components/FileIcon';
import InviteModal from '../components/InviteModal';
import { CommandPalette } from '../components/ui/CommandPalette';
import { useToast } from '../components/ui/Toast';
import { Badge, Kbd } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  X,
  Lock,
  FileCode,
  Check,
  Save,
  Send,
  MessageSquare,
  Sparkles,
  Terminal,
  UserPlus,
  HelpCircle,
  FolderTree,
} from 'lucide-react';

export default function WorkspaceView() {
  const { id: workspaceId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

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
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // Workspace Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      author: 'Alice Chen',
      color: 'text-peer-1',
      time: '10:42 AM',
      text: 'CRDT state vectors converged across node replicas.',
      snippet: null,
    },
    {
      id: 2,
      author: 'Bob Taylor',
      color: 'text-peer-2',
      time: '10:44 AM',
      text: 'Verified: keystroke broadcast latency is under 15ms.',
      snippet: 'src/crdt-sync.ts:L4',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

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
      setCursorPos({ line: 1, col: 1 });
    }
  }, [activeFileId, activeFile]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleContentChange = (e) => {
    if (!canEdit) return;
    const newVal = e.target.value;
    setEditorContent(newVal);
    updateCursor(e);
  };

  const updateCursor = (e) => {
    const textarea = e.target;
    const pos = textarea.selectionStart || 0;
    const textBefore = textarea.value.substring(0, pos);
    const lines = textBefore.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    setCursorPos({ line, col });
  };

  const handleManualSave = async () => {
    if (!activeFileId || !canEdit) return;
    setIsSaving(true);
    try {
      await updateContent(workspaceId, activeFileId, editorContent);
      setSavedFeedback(true);
      addToast({ message: `Saved ${activeFile?.name || 'file'} successfully`, type: 'success' });
      setTimeout(() => setSavedFeedback(false), 1500);
    } catch (e) {
      addToast({ message: 'Failed to save document', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = {
      id: Date.now(),
      author: 'You',
      color: 'text-accent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: chatInput.trim(),
      snippet: null,
    };
    setChatMessages((prev) => [...prev, msg]);
    setChatInput('');
  };

  // Command palette actions list
  const paletteActions = useMemo(() => {
    const fileActions = files
      .filter((f) => !f.isDirectory)
      .map((f) => ({
        id: `file-${f.id}`,
        label: `Open ${f.path}`,
        category: 'Files',
        icon: <FileCode className="w-3.5 h-3.5 text-accent" />,
        onSelect: () => setActiveFile(f.id),
      }));

    return [
      ...fileActions,
      {
        id: 'save-file',
        label: 'Save Active File',
        category: 'Workspace',
        shortcut: 'Ctrl+S',
        icon: <Save className="w-3.5 h-3.5 text-text-muted" />,
        onSelect: handleManualSave,
      },
      {
        id: 'toggle-chat',
        label: isChatOpen ? 'Close Chat' : 'Open Workspace Chat',
        category: 'Workspace',
        icon: <MessageSquare className="w-3.5 h-3.5 text-text-muted" />,
        onSelect: () => setIsChatOpen(!isChatOpen),
      },
      {
        id: 'invite-collab',
        label: 'Invite Collaborators...',
        category: 'Sharing',
        icon: <UserPlus className="w-3.5 h-3.5 text-text-muted" />,
        onSelect: () => setIsInviteOpen(true),
      },
      {
        id: 'dashboard',
        label: 'Return to Dashboard',
        category: 'Navigation',
        icon: <Terminal className="w-3.5 h-3.5 text-text-muted" />,
        onSelect: () => navigate('/dashboard'),
      },
    ];
  }, [files, isChatOpen, activeFile, navigate]);

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
        onOpenCommandPalette={() => setIsPaletteOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* Main Workspace Area (Explorer + Editor Canvas + Optional Chat) */}
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
              <div className="ml-auto pr-3 flex items-center gap-1.5 text-xs text-status-warning font-mono">
                <Lock className="w-3.5 h-3.5" />
                <span>Read-only View</span>
              </div>
            )}

            {/* Save Button for Editors */}
            {canEdit && activeFile && (
              <div className="ml-auto pr-3 flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleManualSave}
                  disabled={isSaving}
                  leftIcon={
                    savedFeedback ? (
                      <Check className="w-3.5 h-3.5 text-accent" />
                    ) : (
                      <Save className="w-3.5 h-3.5 text-text-muted" />
                    )
                  }
                >
                  {savedFeedback ? 'Saved' : 'Save'}
                </Button>
              </div>
            )}
          </div>

          {/* Active File Editor Container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeFile ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* File Path & Language Sub-bar */}
                <div className="h-6 px-4 bg-surface-subtle/50 border-b border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-muted">
                  <span>{activeFile.path}</span>
                  <span className="uppercase text-[10px] text-accent bg-accent-subtle px-1.5 py-0.2 rounded-sm border border-accent-border font-mono">
                    {activeFile.language || 'plaintext'}
                  </span>
                </div>

                {/* Editor Surface */}
                <div className="flex-1 flex overflow-hidden font-mono text-xs">
                  <textarea
                    value={editorContent}
                    readOnly={!canEdit}
                    onChange={handleContentChange}
                    onKeyUp={updateCursor}
                    onClick={updateCursor}
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
                  Choose a file from the explorer on the left or press <Kbd>Ctrl+K</Kbd> to search.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Status Bar */}
          <footer className="h-6 border-t border-border-subtle bg-surface-subtle px-3 flex items-center justify-between text-[11px] font-mono text-text-muted select-none">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-text-secondary">Connected</span>
              </div>
              <span className="text-border-default">|</span>
              <span>CRDT Sync: Active</span>
            </div>

            <div className="flex items-center gap-3">
              <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
              <span className="text-border-default">|</span>
              <span>UTF-8</span>
              <span className="text-border-default">|</span>
              <span className="text-accent uppercase text-[10px]">
                {activeFile?.language || 'plaintext'}
              </span>
            </div>
          </footer>
        </div>

        {/* Right: Collapsible Chat Panel */}
        {isChatOpen && (
          <aside className="w-72 border-l border-border-subtle bg-surface-subtle flex flex-col justify-between text-xs animate-in slide-in-from-right-3 duration-fast">
            {/* Chat Header */}
            <div className="h-9 px-3 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                <MessageSquare className="w-3.5 h-3.5 text-accent" />
                <span>Workspace Chat</span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
                title="Close chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="p-2.5 rounded-md bg-surface-canvas border border-border-subtle text-left">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className={`font-semibold ${msg.color}`}>{msg.author}</span>
                    <span className="text-[10px] text-text-muted font-mono">{msg.time}</span>
                  </div>
                  <p className="text-text-secondary text-xs leading-snug">{msg.text}</p>
                  {msg.snippet && (
                    <div className="mt-1.5 p-1 rounded-sm bg-surface-subtle font-mono text-[10px] text-accent border border-border-subtle">
                      <span>{msg.snippet}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-2 border-t border-border-subtle flex items-center gap-1.5 bg-surface-canvas">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-2.5 py-1.5 rounded-sm bg-surface-subtle border border-border-default text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
              />
              <Button type="submit" variant="primary" size="sm" className="px-2">
                <Send className="w-3 h-3" />
              </Button>
            </form>
          </aside>
        )}
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

      {/* Quick Command Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        actions={paletteActions}
      />
    </div>
  );
}
