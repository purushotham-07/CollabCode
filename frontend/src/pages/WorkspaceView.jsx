import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useFileStore } from '../store/fileStore';
import { useAuthStore } from '../store/authStore';
import { getWebSocketUrl } from '../utils/websocket';
import WorkspaceHeader from '../components/WorkspaceHeader';
import FileTree from '../components/FileTree';
import FileIcon from '../components/FileIcon';
import InviteModal from '../components/InviteModal';
import { CommandPalette } from '../components/ui/CommandPalette';
import { useToast } from '../components/ui/Toast';
import ThemeToggle from '../components/ui/ThemeToggle';
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
  Play,
  RotateCw,
  Code2,
  Maximize2,
  Minimize2,
  ChevronLeft,
  PanelBottom,
  PanelRight,
} from 'lucide-react';

export default function WorkspaceView() {
  const { id: workspaceId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') ||
      (!document.documentElement.classList.contains('light') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const handleThemeChange = (e) => {
      setIsDark(e.detail === 'dark');
    };
    window.addEventListener('collabcode_theme_change', handleThemeChange);
    return () => window.removeEventListener('collabcode_theme_change', handleThemeChange);
  }, []);

  const {
    currentWorkspace,
    fetchWorkspace,
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
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [sidePanelTab, setSidePanelTab] = useState('console'); // 'console' | 'chat'
  const [editorContent, setEditorContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const { user } = useAuthStore();
  const wsRef = useRef(null);
  const isRemoteUpdateRef = useRef(false);
  const activeFileIdRef = useRef(activeFileId);
  const sendDebounceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  useEffect(() => {
    activeFileIdRef.current = activeFileId;
  }, [activeFileId]);

  // Resizable Panels & Docking State
  const [panelDock, setPanelDock] = useState(() => {
    return localStorage.getItem('collabcode_panel_dock') || 'right'; // 'right' | 'bottom'
  });
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('collabcode_sidebar_width');
    return saved ? Math.max(160, Math.min(500, Number(saved))) : 240;
  });
  const [sidePanelWidth, setSidePanelWidth] = useState(() => {
    const saved = localStorage.getItem('collabcode_sidepanel_width');
    return saved ? Math.max(260, Math.min(800, Number(saved))) : 360;
  });
  const [sidePanelHeight, setSidePanelHeight] = useState(() => {
    const saved = localStorage.getItem('collabcode_sidepanel_height');
    return saved ? Math.max(140, Math.min(600, Number(saved))) : 240;
  });
  const [isSidePanelExpanded, setIsSidePanelExpanded] = useState(false);
  const [prevSidePanelSize, setPrevSidePanelSize] = useState({ width: 360, height: 240 });
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingSidePanelW, setIsResizingSidePanelW] = useState(false);
  const [isResizingSidePanelH, setIsResizingSidePanelH] = useState(false);

  const isResizing = isResizingSidebar || isResizingSidePanelW || isResizingSidePanelH;

  // Real-time mouse drag listeners for resizable panels
  useEffect(() => {
    if (!isResizing) return;

    if (isResizingSidebar || isResizingSidePanelW) {
      document.body.style.cursor = 'col-resize';
    } else if (isResizingSidePanelH) {
      document.body.style.cursor = 'row-resize';
    }
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e) => {
      if (isResizingSidebar) {
        const newWidth = Math.max(160, Math.min(500, e.clientX));
        setSidebarWidth(newWidth);
      }
      if (isResizingSidePanelW) {
        const newWidth = Math.max(260, Math.min(window.innerWidth * 0.75, window.innerWidth - e.clientX));
        setSidePanelWidth(newWidth);
        setIsSidePanelExpanded(false);
      }
      if (isResizingSidePanelH) {
        const newHeight = Math.max(120, Math.min(window.innerHeight * 0.7, window.innerHeight - e.clientY - 24));
        setSidePanelHeight(newHeight);
        setIsSidePanelExpanded(false);
      }
    };

    const handleMouseUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      if (isResizingSidebar) {
        setIsResizingSidebar(false);
        setSidebarWidth((w) => {
          localStorage.setItem('collabcode_sidebar_width', String(w));
          return w;
        });
      }
      if (isResizingSidePanelW) {
        setIsResizingSidePanelW(false);
        setSidePanelWidth((w) => {
          localStorage.setItem('collabcode_sidepanel_width', String(w));
          return w;
        });
      }
      if (isResizingSidePanelH) {
        setIsResizingSidePanelH(false);
        setSidePanelHeight((h) => {
          localStorage.setItem('collabcode_sidepanel_height', String(h));
          return h;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isResizingSidebar, isResizingSidePanelW, isResizingSidePanelH]);

  const handleToggleExpand = () => {
    if (isSidePanelExpanded) {
      if (panelDock === 'right') {
        setSidePanelWidth(prevSidePanelSize.width);
      } else {
        setSidePanelHeight(prevSidePanelSize.height);
      }
      setIsSidePanelExpanded(false);
    } else {
      setPrevSidePanelSize({ width: sidePanelWidth, height: sidePanelHeight });
      if (panelDock === 'right') {
        setSidePanelWidth(Math.min(700, Math.round(window.innerWidth * 0.6)));
      } else {
        setSidePanelHeight(Math.min(500, Math.round(window.innerHeight * 0.55)));
      }
      setIsSidePanelExpanded(true);
    }
  };

  const handleToggleDock = () => {
    const nextDock = panelDock === 'right' ? 'bottom' : 'right';
    setPanelDock(nextDock);
    localStorage.setItem('collabcode_panel_dock', nextDock);
  };

  // Code Execution Sandbox State
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Workspace Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace(workspaceId).catch(() => navigate('/dashboard'));
      fetchFiles(workspaceId);
    }
  }, [workspaceId, fetchWorkspace, fetchFiles, navigate]);

  // Real-time Collaboration WebSocket Connection (Code edit sync, messages, tree refresh, presence)
  useEffect(() => {
    if (!workspaceId) return;

    let isMounted = true;

    const connectWebSocket = () => {
      if (
        wsRef.current &&
        (wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }

      try {
        const currentUser = useAuthStore.getState().user;
        const wsUrl = getWebSocketUrl(workspaceId, currentUser);
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setWsConnected(true);
          // Explicit join handshake
          ws.send(
            JSON.stringify({
              type: 'JOIN',
              workspaceId,
              userId: currentUser?.id,
              userName: currentUser?.displayName || currentUser?.name || 'Anonymous',
              avatarUrl: currentUser?.avatarUrl,
            })
          );
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            switch (data.type) {
              case 'CODE_CHANGE': {
                // If code change is for current open file, update editor content
                if (data.fileId === activeFileIdRef.current) {
                  isRemoteUpdateRef.current = true;
                  setEditorContent(data.content || '');
                }
                // Always update content in file store cache so inactive files stay updated
                useFileStore.setState((state) => ({
                  files: state.files.map((f) =>
                    f.id === data.fileId ? { ...f, content: data.content } : f
                  ),
                }));
                break;
              }
              case 'CHAT_MESSAGE': {
                const currentUser = useAuthStore.getState().user;
                const msg = data.message;
                const isMe =
                  msg.senderId === currentUser?.id ||
                  (currentUser?.displayName && msg.author === currentUser.displayName);
                setChatMessages((prev) => {
                  if (prev.some((m) => String(m.id) === String(msg.id))) {
                    return prev;
                  }
                  return [...prev, { ...msg, isMe }];
                });
                if (!isSidePanelOpen || sidePanelTab !== 'chat') {
                  setUnreadChatCount((count) => count + 1);
                }
                break;
              }
              case 'CHAT_HISTORY': {
                const currentUser = useAuthStore.getState().user;
                const history = (data.messages || []).map((m) => ({
                  ...m,
                  isMe:
                    m.senderId === currentUser?.id ||
                    (currentUser?.displayName && m.author === currentUser.displayName),
                }));
                setChatMessages(history);
                break;
              }
              case 'FILE_TREE_CHANGE': {
                fetchFiles(workspaceId);
                break;
              }
              case 'PRESENCE_UPDATE': {
                if (Array.isArray(data.users)) {
                  setOnlineUsers(data.users);
                }
                break;
              }
              default:
                break;
            }
          } catch (err) {
            console.error('Failed to parse WebSocket message', err);
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setWsConnected(false);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMounted) connectWebSocket();
          }, 2500);
        };

        ws.onerror = () => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        };
      } catch (e) {
        console.error('WebSocket connection error:', e);
      }
    };

    connectWebSocket();

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'PING' }));
      }
    }, 25000);

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      if (sendDebounceRef.current) clearTimeout(sendDebounceRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [workspaceId, fetchFiles, isSidePanelOpen, sidePanelTab]);

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
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleManualSave();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeFileId, editorContent, canEdit]);

  const handleManualSave = async () => {
    if (!activeFileId || !canEdit) return;
    setIsSaving(true);
    try {
      await updateContent(workspaceId, activeFileId, editorContent);
      setSavedFeedback(true);
      addToast({ message: `Saved ${activeFile?.name || 'file'}`, type: 'success' });
      setTimeout(() => setSavedFeedback(false), 1500);
    } catch (e) {
      addToast({ message: 'Failed to save document', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // In-Browser Code Execution Runner
  const handleRunCode = () => {
    if (!editorContent.trim()) {
      addToast({ message: 'No code to execute', type: 'info' });
      return;
    }

    setIsSidePanelOpen(true);
    setSidePanelTab('console');
    setIsRunningCode(true);

    const logs = [];
    const customConsole = {
      log: (...args) => logs.push({ type: 'log', text: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }),
      error: (...args) => logs.push({ type: 'error', text: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }),
      warn: (...args) => logs.push({ type: 'warn', text: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }),
      info: (...args) => logs.push({ type: 'info', text: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }),
    };

    try {
      const startTime = performance.now();
      // Execute in sandbox function with custom console
      const runFn = new Function('console', `
        try {
          ${editorContent}
        } catch(err) {
          console.error(err.message || String(err));
        }
      `);
      runFn(customConsole);
      const executionTime = (performance.now() - startTime).toFixed(1);

      if (logs.length === 0) {
        logs.push({ type: 'status', text: `[Done] exited with code 0 in ${executionTime}ms (no console outputs)` });
      } else {
        logs.push({ type: 'status', text: `[Done] exited with code 0 in ${executionTime}ms` });
      }
    } catch (err) {
      logs.push({ type: 'error', text: `SyntaxError: ${err.message}` });
      logs.push({ type: 'status_error', text: `[Done] exited with error` });
    }

    setConsoleLogs(logs);
    setIsRunningCode(false);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const text = chatInput.trim();
    const author = user?.displayName || user?.name || 'You';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msgPayload = {
      id: Date.now().toString(),
      author,
      text,
      time,
      senderId: user?.id || 'anon',
      avatarUrl: user?.avatarUrl,
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'CHAT_MESSAGE',
          workspaceId,
          message: msgPayload,
        })
      );
    } else {
      setChatMessages((prev) => [...prev, { ...msgPayload, isMe: true }]);
    }

    setChatInput('');
  };

  const handleEditorChange = (newVal) => {
    const val = newVal ?? '';
    if (!canEdit) return;

    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    setEditorContent(val);

    // Update in local file store state so tabs switch seamlessly
    useFileStore.setState((state) => ({
      files: state.files.map((f) => (f.id === activeFileId ? { ...f, content: val } : f)),
    }));

    // Broadcast real-time CODE_CHANGE over WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && activeFileId) {
      clearTimeout(sendDebounceRef.current);
      sendDebounceRef.current = setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: 'CODE_CHANGE',
              workspaceId,
              fileId: activeFileId,
              content: val,
            })
          );
        }
      }, 25);
    }
  };

  const handleCreateFile = async (req) => {
    const newFile = await createFile(workspaceId, req);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'FILE_TREE_CHANGE', workspaceId, action: 'CREATE' }));
    }
    return newFile;
  };

  const handleRenameFile = async (fileId, newPath) => {
    await renameFile(workspaceId, fileId, newPath);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'FILE_TREE_CHANGE', workspaceId, action: 'RENAME' }));
    }
  };

  const handleDeleteFile = async (fileId) => {
    await deleteFile(workspaceId, fileId);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'FILE_TREE_CHANGE', workspaceId, action: 'DELETE' }));
    }
  };

  const openChatTab = () => {
    setIsSidePanelOpen(true);
    setSidePanelTab('chat');
    setUnreadChatCount(0);
  };

  // Detect file language for Monaco Editor
  const getLanguage = (fileName) => {
    if (!fileName) return 'javascript';
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'py':
        return 'python';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'java':
        return 'java';
      default:
        return 'javascript';
    }
  };

  // Command palette actions
  const paletteActions = useMemo(() => {
    const fileActions = files
      .filter((f) => !f.isDirectory)
      .map((f) => ({
        id: `file-${f.id}`,
        label: `Open ${f.path}`,
        category: 'Files',
        icon: <FileCode className="w-3.5 h-3.5 text-[#0071e3]" />,
        onSelect: () => setActiveFile(f.id),
      }));

    return [
      ...fileActions,
      {
        id: 'run-code',
        label: 'Run Active Code (JS)',
        category: 'Execution',
        shortcut: 'Ctrl+R',
        icon: <Play className="w-3.5 h-3.5 text-[#34c759]" />,
        onSelect: handleRunCode,
      },
      {
        id: 'save-file',
        label: 'Save Active File',
        category: 'Workspace',
        shortcut: 'Ctrl+S',
        icon: <Save className="w-3.5 h-3.5 text-[#a1a1a6]" />,
        onSelect: handleManualSave,
      },
      {
        id: 'invite-collab',
        label: 'Invite Collaborators...',
        category: 'Sharing',
        icon: <UserPlus className="w-3.5 h-3.5 text-[#a1a1a6]" />,
        onSelect: () => setIsInviteOpen(true),
      },
      {
        id: 'dashboard',
        label: 'Return to Dashboard',
        category: 'Navigation',
        icon: <Terminal className="w-3.5 h-3.5 text-[#a1a1a6]" />,
        onSelect: () => navigate('/dashboard'),
      },
    ];
  }, [files, activeFile, navigate, editorContent]);

  const renderPanelContent = () => (
    <div className="flex flex-col h-full overflow-hidden text-xs">
      {/* Header Tabs & Controls */}
      <div className="h-10 px-3 border-b border-border-subtle flex items-center justify-between flex-shrink-0 bg-surface-subtle">
        <div className="flex items-center gap-1 bg-surface-canvas border border-border-default p-0.5 rounded-lg">
          <button
            onClick={() => setSidePanelTab('console')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              sidePanelTab === 'console'
                ? 'bg-surface-raised text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Terminal className="w-3 h-3 text-[#30d158]" />
            <span>Console</span>
          </button>
          <button
            onClick={() => setSidePanelTab('chat')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              sidePanelTab === 'chat'
                ? 'bg-surface-raised text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <MessageSquare className="w-3 h-3 text-[#0071e3]" />
            <span>Messages</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Dock Orientation Toggle: Bottom vs Right */}
          <button
            onClick={handleToggleDock}
            className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors"
            title={panelDock === 'right' ? 'Dock panel to bottom' : 'Dock panel to right'}
          >
            {panelDock === 'right' ? (
              <PanelBottom className="w-3.5 h-3.5" />
            ) : (
              <PanelRight className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Expand / Minimize */}
          <button
            onClick={handleToggleExpand}
            className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors"
            title={isSidePanelExpanded ? 'Restore size' : 'Expand panel'}
          >
            {isSidePanelExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Close */}
          <button
            onClick={() => setIsSidePanelOpen(false)}
            className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors"
            title="Close panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs select-text">
        {sidePanelTab === 'console' ? (
          <div className="flex flex-col h-full font-mono">
            <div className="text-[11px] text-text-muted pb-2 mb-2 border-b border-border-subtle flex items-center justify-between select-none">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-text-secondary">
                <Terminal className="w-3 h-3 text-[#30d158]" />
                <span>Console Output</span>
              </span>
              <button
                onClick={() => setConsoleLogs([])}
                className="hover:text-text-primary text-[10px] text-text-secondary hover:underline cursor-pointer select-none"
              >
                Clear
              </button>
            </div>

            {consoleLogs.length === 0 ? (
              <div className="text-center py-10 text-text-muted select-none">
                <Terminal className="w-6 h-6 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Click "Run" at the top to execute your code.</p>
              </div>
            ) : (
              <div className="flex-1 font-mono text-[12px] leading-5 space-y-0.5 select-text">
                {consoleLogs.map((log, index) => {
                  if (log.type === 'status') {
                    return (
                      <div
                        key={index}
                        className="mt-2.5 pt-2 border-t border-border-subtle/70 text-[11px] text-text-muted flex items-center gap-1.5 select-none font-mono"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
                        <span className="text-[#30d158] font-medium">{log.text}</span>
                      </div>
                    );
                  }
                  if (log.type === 'status_error') {
                    return (
                      <div
                        key={index}
                        className="mt-2.5 pt-2 border-t border-border-subtle/70 text-[11px] text-text-muted flex items-center gap-1.5 select-none font-mono"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff453a]" />
                        <span className="text-[#ff453a] font-medium">{log.text}</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-2 py-0.5 px-2 rounded transition-colors ${
                        log.type === 'error'
                          ? 'text-[#ff453a] bg-[#ff453a]/10 border-l-2 border-[#ff453a]'
                          : log.type === 'warn'
                          ? 'text-[#ff9f0a] bg-[#ff9f0a]/10 border-l-2 border-[#ff9f0a]'
                          : log.type === 'info'
                          ? 'text-[#0a84ff]'
                          : 'text-text-primary hover:bg-surface-raised/40'
                      }`}
                    >
                      <span className="text-text-muted/60 select-none text-[10px] leading-5">&gt;</span>
                      <pre className="whitespace-pre-wrap break-all font-mono text-[12px] leading-5 flex-1">{log.text}</pre>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto px-1 py-2 space-y-2.5">
              {chatMessages.length === 0 ? (
                <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center p-6 text-text-muted select-none">
                  <MessageSquare className="w-8 h-8 mb-2 opacity-30 stroke-[1.5]" />
                  <p className="text-xs font-medium text-text-secondary">Workspace Chat</p>
                  <p className="text-[11px] text-text-muted mt-1 max-w-[200px]">
                    No messages yet. Send a message to start collaborating.
                  </p>
                </div>
              ) : (
                chatMessages.map((m) => {
                  const isMe = m.isMe || m.author === 'You';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm break-words transition-all ${
                          isMe
                            ? 'bg-[#0071e3] text-white rounded-tr-xs'
                            : 'bg-surface-raised border border-border-subtle text-text-primary rounded-tl-xs'
                        }`}
                      >
                        {!isMe && (
                          <div className="text-[10px] font-semibold text-[#0071e3] mb-0.5">
                            {m.author}
                          </div>
                        )}
                        <div className="flex items-end justify-between gap-3">
                          <span className="flex-1 whitespace-pre-wrap">{m.text}</span>
                          <span
                            className={`text-[9px] font-mono select-none flex-shrink-0 mt-1 self-end ${
                              isMe ? 'text-white/70' : 'text-text-muted'
                            }`}
                          >
                            {m.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            <form onSubmit={handleSendChat} className="mt-2 pt-2.5 border-t border-border-subtle flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message collaborators..."
                className="flex-1 px-3.5 py-1.5 rounded-full bg-surface-canvas border border-border-default text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-[#0071e3] transition-colors"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 rounded-full bg-[#0071e3] text-white hover:bg-[#0077ed] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors active:scale-95 flex items-center justify-center shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-surface-canvas text-text-primary overflow-hidden select-none transition-colors duration-200">
      {/* Apple-style macOS Window Bar */}
      <div className="h-11 bg-surface-subtle border-b border-border-subtle px-4 flex items-center justify-between text-xs transition-colors duration-200">
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-raised border border-border-default/70 hover:border-border-default transition-all text-xs font-medium cursor-pointer shadow-sm active:scale-95"
            title="Return to Dashboard"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-border-subtle">
            <span className="font-semibold text-text-primary tracking-tight">{currentWorkspace?.name || 'Studio'}</span>
            <span className="text-text-muted">/</span>
            <span className="text-text-secondary font-mono text-[11px]">{activeFile?.name || 'No file selected'}</span>
          </div>
        </div>

        {/* Center: Command Palette Trigger */}
        <button
          onClick={() => setIsPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised hover:bg-surface-active border border-border-default text-[11px] text-text-secondary transition-all shadow-sm"
        >
          <span>Quick actions & search</span>
          <kbd className="px-1.5 py-0.5 rounded bg-surface-overlay border border-border-subtle text-[10px] font-mono text-text-muted">Cmd+K</kbd>
        </button>

        {/* Right: Actions (Run, Save, Invite, ThemeToggle, Toggle Drawer) */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunningCode || !activeFile}
            className="px-3 py-1 rounded-full bg-[#34c759]/15 hover:bg-[#34c759]/25 text-[#30d158] border border-[#30d158]/30 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Execute JavaScript snippet in browser sandbox"
          >
            <Play className="w-3 h-3 fill-[#30d158]" />
            <span>Run</span>
          </button>

          {/* Save Button */}
          {canEdit && activeFile && (
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border ${
                savedFeedback
                  ? 'bg-[#30d158]/20 border-[#30d158]/30 text-[#30d158]'
                  : 'bg-surface-raised hover:bg-surface-active border-border-default text-text-primary shadow-sm'
              }`}
            >
              {savedFeedback ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
              <span>{savedFeedback ? 'Saved' : 'Save'}</span>
            </button>
          )}

          {/* Online Collaborators Presence */}
          <div
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-full bg-surface-raised border border-border-default hover:bg-surface-active transition-all"
            title="Active Collaborators (Click to invite)"
          >
            <div className="flex -space-x-1.5 overflow-hidden">
              {(onlineUsers.length > 0 ? onlineUsers : (currentWorkspace?.members || [])).slice(0, 4).map((u, i) => (
                <div
                  key={u.sessionId || u.userId || i}
                  className="w-5 h-5 rounded-full bg-[#0071e3]/20 border border-surface-subtle flex items-center justify-center text-[10px] font-semibold text-[#0071e3]"
                  title={u.userName || u.displayName || 'Collaborator'}
                >
                  {(u.userName || u.displayName || 'U').charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            <span className="flex items-center gap-1 text-[11px] font-medium text-text-secondary">
              <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-[#30d158] animate-pulse' : 'bg-yellow-500'}`} />
              <span className="hidden sm:inline">{onlineUsers.length || 1} online</span>
            </span>
          </div>

          {/* Invite Button */}
          <button
            onClick={() => setIsInviteOpen(true)}
            className="px-3 py-1 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <UserPlus className="w-3 h-3" />
            <span className="hidden sm:inline">Invite</span>
          </button>

          {/* Chat Quick Button with unread badge */}
          <button
            onClick={openChatTab}
            className={`relative p-1.5 rounded-full border transition-all ${
              isSidePanelOpen && sidePanelTab === 'chat'
                ? 'bg-[#0071e3] text-white border-[#0071e3]'
                : 'bg-surface-raised border-border-default text-text-secondary hover:text-text-primary'
            }`}
            title="Messages"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {unreadChatCount > 0 && !(isSidePanelOpen && sidePanelTab === 'chat') && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff3b30] text-white text-[9px] font-bold flex items-center justify-center shadow animate-pulse">
                {unreadChatCount > 9 ? '9+' : unreadChatCount}
              </span>
            )}
          </button>

          {/* Toggle Panel Button */}
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className={`p-1.5 rounded-full border transition-all ${
              isSidePanelOpen
                ? 'bg-[#0071e3] text-white border-[#0071e3]'
                : 'bg-surface-raised border-border-default text-text-secondary hover:text-text-primary'
            }`}
            title="Toggle Console / Chat Drawer"
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace Area (Explorer + Monaco Editor + Optional Right Panel) */}
      <div className={`flex-1 flex overflow-hidden ${isResizingSidebar || isResizingSidePanelW ? 'cursor-col-resize' : ''}`}>
        {/* Left: File Explorer Sidebar */}
        <FileTree
          width={sidebarWidth}
          files={files}
          activeFileId={activeFileId}
          onSelectFile={setActiveFile}
          onCreateFile={handleCreateFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
          canEdit={canEdit}
        />

        {/* Left Explorer Resizer Handle */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizingSidebar(true);
          }}
          onDoubleClick={() => {
            setSidebarWidth(240);
            localStorage.setItem('collabcode_sidebar_width', '240');
          }}
          title="Drag to resize explorer (Double-click to reset)"
          className={`w-1.5 cursor-col-resize z-20 group relative flex items-center justify-center select-none flex-shrink-0 transition-colors ${
            isResizingSidebar ? 'bg-[#0071e3]' : 'bg-transparent hover:bg-[#0071e3]/60'
          }`}
        >
          <div className="w-0.5 h-8 rounded-full bg-border-default group-hover:bg-white/80 transition-colors" />
        </div>

        {/* Center: Editor Canvas */}
        <div className={`flex-1 flex flex-col bg-surface-canvas overflow-hidden min-w-0 ${
          isResizing ? 'pointer-events-none select-none' : ''
        }`}>
          {/* File Tabs Bar */}
          <div className="h-9 bg-surface-subtle border-b border-border-subtle flex items-center px-2 gap-1 overflow-x-auto flex-shrink-0">
            {openFileIds.map((fileId) => {
              const file = files.find((f) => f.id === fileId);
              if (!file) return null;
              const isActive = file.id === activeFileId;

              return (
                <div
                  key={file.id}
                  onClick={() => setActiveFile(file.id)}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'bg-surface-raised text-text-primary font-medium border border-border-default shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'
                  }`}
                >
                  <FileIcon path={file.path} isDirectory={false} className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[140px]">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFile(file.id);
                    }}
                    className="p-0.5 rounded-full hover:bg-surface-overlay text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            {!canEdit && (
              <div className="ml-auto pr-3 flex items-center gap-1.5 text-xs text-[#ff9f0a] font-mono">
                <Lock className="w-3.5 h-3.5" />
                <span>Read-only</span>
              </div>
            )}
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {activeFile ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Editor
                  height="100%"
                  theme={isDark ? 'vs-dark' : 'light'}
                  language={getLanguage(activeFile.name)}
                  value={editorContent}
                  onChange={handleEditorChange}
                  options={{
                    readOnly: !canEdit,
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: 'JetBrains Mono, SF Mono, Menlo, monospace',
                    lineHeight: 22,
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    renderLineHighlight: 'all',
                    scrollBeyondLastLine: false,
                    padding: { top: 12, bottom: 12 },
                  }}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-text-muted">
                <FileCode className="w-12 h-12 mb-3 text-text-muted opacity-40" />
                <p className="text-sm font-semibold text-text-primary">No file open</p>
                <p className="text-xs text-text-secondary mt-1">
                  Select a file from the explorer on the left or press <kbd className="px-1 py-0.5 rounded bg-surface-raised border border-border-default font-mono text-[10px] text-text-primary">Cmd+K</kbd> to search.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Docked Drawer (when open and docked to bottom) */}
          {isSidePanelOpen && panelDock === 'bottom' && (
            <>
              {/* Horizontal Resizer Handle */}
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizingSidePanelH(true);
                }}
                onDoubleClick={() => {
                  setSidePanelHeight(240);
                  localStorage.setItem('collabcode_sidepanel_height', '240');
                }}
                title="Drag to resize panel height (Double-click to reset)"
                className={`h-1.5 cursor-row-resize z-20 group relative flex items-center justify-center select-none flex-shrink-0 transition-colors ${
                  isResizingSidePanelH
                    ? 'bg-[#0071e3]'
                    : 'bg-border-subtle/50 hover:bg-[#0071e3]/60 border-t border-border-subtle'
                }`}
              >
                <div className="h-0.5 w-12 rounded-full bg-border-default group-hover:bg-white/80 transition-colors" />
              </div>

              {/* Bottom Drawer Box */}
              <div
                style={{ height: `${sidePanelHeight}px` }}
                className="flex-shrink-0 bg-surface-subtle border-t border-border-subtle flex flex-col overflow-hidden"
              >
                {renderPanelContent()}
              </div>
            </>
          )}

          {/* Minimalist Apple Bottom Status Bar */}
          <footer className="h-6 border-t border-border-subtle bg-surface-subtle px-3 flex items-center justify-between text-[11px] font-mono text-text-secondary select-none flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-[#30d158]' : 'bg-[#ff9f0a]'}`} />
                <span className="text-text-secondary">{wsConnected ? 'Real-Time Sync Active' : 'Connecting Sync...'}</span>
              </div>
              <span className="text-border-default">|</span>
              <span>{onlineUsers.length || 1} Collaborator{(onlineUsers.length || 1) === 1 ? '' : 's'} Online</span>
            </div>

            <div className="flex items-center gap-3">
              <span>UTF-8</span>
              <span className="text-border-default">|</span>
              <span className="text-[#0071e3] uppercase text-[10px] font-medium">
                {activeFile ? getLanguage(activeFile.name) : 'plaintext'}
              </span>
            </div>
          </footer>
        </div>

        {/* Right Docked Drawer (when open and docked to right) */}
        {isSidePanelOpen && panelDock === 'right' && (
          <>
            {/* Vertical Resizer Handle */}
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizingSidePanelW(true);
              }}
              onDoubleClick={() => {
                setSidePanelWidth(360);
                localStorage.setItem('collabcode_sidepanel_width', '360');
              }}
              title="Drag to resize drawer width (Double-click to reset)"
              className={`w-1.5 cursor-col-resize z-20 group relative flex items-center justify-center select-none flex-shrink-0 transition-colors ${
                isResizingSidePanelW
                  ? 'bg-[#0071e3]'
                  : 'bg-transparent hover:bg-[#0071e3]/60 border-l border-border-subtle'
              }`}
            >
              <div className="w-0.5 h-10 rounded-full bg-border-default group-hover:bg-white/80 transition-colors" />
            </div>

            {/* Right Drawer Box */}
            <aside
              style={{ width: `${sidePanelWidth}px` }}
              className="flex-shrink-0 border-l border-border-subtle bg-surface-subtle flex flex-col justify-between text-xs animate-in slide-in-from-right-3 duration-200 overflow-hidden"
            >
              {renderPanelContent()}
            </aside>
          </>
        )}
      </div>

      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        workspace={currentWorkspace}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        actions={paletteActions}
      />
    </div>
  );
}
