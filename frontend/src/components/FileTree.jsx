import React, { useState, useMemo } from 'react';
import {
  FilePlus,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Edit2,
  Trash2,
  MoreVertical,
  Check,
  X,
} from 'lucide-react';
import FileIcon from './FileIcon';

export default function FileTree({
  files = [],
  activeFileId,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
  canEdit = true,
}) {
  const [openFolders, setOpenFolders] = useState(new Set(['src']));
  const [creatingType, setCreatingType] = useState(null); // 'file' | 'folder' | null
  const [creatingParent, setCreatingParent] = useState(''); // parent path
  const [newItemName, setNewItemName] = useState('');
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  // Transform flat file list into hierarchical tree
  const tree = useMemo(() => {
    const root = { name: '', path: '', isDirectory: true, children: {} };

    files.forEach((file) => {
      const parts = file.path.split('/');
      let current = root;

      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const currentPath = parts.slice(0, index + 1).join('/');

        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            path: currentPath,
            isDirectory: isLast ? file.isDirectory : true,
            file: isLast ? file : null,
            children: {},
          };
        } else if (isLast) {
          current.children[part].file = file;
          current.children[part].isDirectory = file.isDirectory;
        }
        current = current.children[part];
      });
    });

    const toArray = (node) => {
      const children = Object.values(node.children);
      children.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
      return children.map((c) => ({
        ...c,
        children: toArray(c),
      }));
    };

    return toArray(root);
  }, [files]);

  const toggleFolder = (path) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleStartCreate = (type, parentPath = '') => {
    setCreatingType(type);
    setCreatingParent(parentPath);
    setNewItemName('');
    if (parentPath && !openFolders.has(parentPath)) {
      setOpenFolders((prev) => new Set(prev).add(parentPath));
    }
  };

  const handleCommitCreate = () => {
    if (!newItemName.trim()) {
      setCreatingType(null);
      return;
    }

    const fullPath = creatingParent
      ? `${creatingParent}/${newItemName.trim()}`
      : newItemName.trim();

    onCreateFile({
      path: fullPath,
      isDirectory: creatingType === 'folder',
      content: '',
    });

    setCreatingType(null);
    setNewItemName('');
  };

  const handleStartRename = (file) => {
    setRenamingId(file.id);
    setRenameValue(file.name);
  };

  const handleCommitRename = (fileId) => {
    if (renameValue.trim() && renamingId) {
      onRenameFile(fileId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const renderTreeNodes = (nodes, depth = 0) => {
    return nodes.map((node) => {
      const isOpen = openFolders.has(node.path);
      const isSelected = node.file?.id === activeFileId;
      const isRenaming = node.file?.id === renamingId;

      return (
        <div key={node.path} className="select-none">
          {/* Node Row */}
          <div
            onClick={() => {
              if (node.isDirectory) {
                toggleFolder(node.path);
              } else if (node.file) {
                onSelectFile(node.file.id);
              }
            }}
            style={{ paddingLeft: `${depth * 14 + 10}px` }}
            className={`group relative flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer text-xs font-mono transition-colors ${
              isSelected
                ? 'bg-brand-500/15 text-brand-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {node.isDirectory ? (
                <span className="text-slate-500 flex-shrink-0">
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </span>
              ) : (
                <span className="w-3.5" />
              )}

              <FileIcon path={node.path} isDirectory={node.isDirectory} isOpen={isOpen} />

              {isRenaming ? (
                <div
                  className="flex items-center gap-1 flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCommitRename(node.file.id);
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                    className="w-full bg-slate-900 border border-brand-500/80 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    onClick={() => handleCommitRename(node.file.id)}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setRenamingId(null)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="truncate">{node.name}</span>
              )}
            </div>

            {/* Hover Actions (Edit/Delete/Create inside folder) */}
            {canEdit && !isRenaming && node.file && (
              <div
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-2 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                {node.isDirectory && (
                  <button
                    onClick={() => handleStartCreate('file', node.path)}
                    title="New File inside"
                    className="p-1 hover:text-brand-400 rounded hover:bg-slate-700/60"
                  >
                    <FilePlus className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => handleStartRename(node.file)}
                  title="Rename"
                  className="p-1 hover:text-sky-400 rounded hover:bg-slate-700/60"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${node.isDirectory ? 'directory' : 'file'} "${node.name}"?`)) {
                      onDeleteFile(node.file.id);
                    }
                  }}
                  title="Delete"
                  className="p-1 hover:text-red-400 rounded hover:bg-slate-700/60"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Inline creation input inside this folder */}
          {creatingType && creatingParent === node.path && (
            <div
              style={{ paddingLeft: `${(depth + 1) * 14 + 10}px` }}
              className="py-1 pr-2 flex items-center gap-1.5"
            >
              <FileIcon path={newItemName} isDirectory={creatingType === 'folder'} />
              <input
                type="text"
                autoFocus
                placeholder={creatingType === 'file' ? 'filename.js' : 'folder-name'}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCommitCreate();
                  if (e.key === 'Escape') setCreatingType(null);
                }}
                className="w-full bg-slate-900 border border-brand-500 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
              />
              <button onClick={handleCommitCreate} className="text-emerald-400">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setCreatingType(null)} className="text-red-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Children nodes if folder is open */}
          {node.isDirectory && isOpen && node.children.length > 0 && (
            <div>{renderTreeNodes(node.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-r border-slate-800 w-64 select-none">
      {/* File Tree Header */}
      <div className="h-10 px-3.5 border-b border-slate-800 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          Explorer
        </span>
        {canEdit && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleStartCreate('file', '')}
              title="New File"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <FilePlus className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleStartCreate('folder', '')}
              title="New Folder"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Inline Creation Input at Root */}
      {creatingType && creatingParent === '' && (
        <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/60 flex items-center gap-1.5">
          <FileIcon path={newItemName} isDirectory={creatingType === 'folder'} />
          <input
            type="text"
            autoFocus
            placeholder={creatingType === 'file' ? 'filename.js' : 'folder-name'}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCommitCreate();
              if (e.key === 'Escape') setCreatingType(null);
            }}
            className="w-full bg-slate-900 border border-brand-500 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
          />
          <button onClick={handleCommitCreate} className="text-emerald-400">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setCreatingType(null)} className="text-red-400">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Files Tree */}
      <div className="flex-1 overflow-y-auto py-2 px-1">
        {files.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 font-mono">
            No files in workspace
          </div>
        ) : (
          renderTreeNodes(tree)
        )}
      </div>
    </div>
  );
}
