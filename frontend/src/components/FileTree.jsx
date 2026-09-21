import React, { useState, useMemo } from 'react';
import {
  FilePlus,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Edit2,
  Trash2,
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
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            className={`group relative flex items-center justify-between py-1 pr-2 rounded-sm cursor-pointer text-xs font-mono transition-colors duration-100 ${
              isSelected
                ? 'bg-surface-raised text-accent font-medium'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-raised/40'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {node.isDirectory ? (
                <span className="text-text-muted flex-shrink-0">
                  {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </span>
              ) : (
                <span className="w-3" />
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
                    className="w-full bg-surface-canvas border border-accent rounded-sm px-1 py-0.2 text-xs text-text-primary focus:outline-none"
                  />
                  <button
                    onClick={() => handleCommitRename(node.file.id)}
                    className="text-accent"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setRenamingId(null)}
                    className="text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span className="truncate">{node.name}</span>
              )}
            </div>

            {/* Hover Actions */}
            {canEdit && !isRenaming && node.file && (
              <div
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-1.5 transition-opacity duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                {node.isDirectory && (
                  <button
                    onClick={() => handleStartCreate('file', node.path)}
                    title="New File inside"
                    className="p-0.5 hover:text-accent rounded-sm hover:bg-surface-raised"
                  >
                    <FilePlus className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => handleStartRename(node.file)}
                  title="Rename"
                  className="p-0.5 hover:text-text-primary rounded-sm hover:bg-surface-raised"
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
                  className="p-0.5 hover:text-red-400 rounded-sm hover:bg-surface-raised"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Inline creation input inside this folder */}
          {creatingType && creatingParent === node.path && (
            <div
              style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
              className="py-1 pr-2 flex items-center gap-1"
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
                className="w-full bg-surface-canvas border border-accent rounded-sm px-1.5 py-0.5 text-xs text-text-primary focus:outline-none"
              />
              <button onClick={handleCommitCreate} className="text-accent">
                <Check className="w-3 h-3" />
              </button>
              <button onClick={() => setCreatingType(null)} className="text-red-400">
                <X className="w-3 h-3" />
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
    <div className="flex flex-col h-full bg-surface-subtle border-r border-border-subtle w-60 select-none">
      {/* File Tree Header */}
      <div className="h-9 px-3 border-b border-border-subtle flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono">
          Explorer
        </span>
        {canEdit && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => handleStartCreate('file', '')}
              title="New File"
              className="p-1 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors duration-100"
            >
              <FilePlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleStartCreate('folder', '')}
              title="New Folder"
              className="p-1 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors duration-100"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Inline Creation Input at Root */}
      {creatingType && creatingParent === '' && (
        <div className="px-2.5 py-1.5 border-b border-border-subtle bg-surface-canvas flex items-center gap-1">
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
            className="w-full bg-surface-subtle border border-accent rounded-sm px-1.5 py-0.5 text-xs text-text-primary focus:outline-none"
          />
          <button onClick={handleCommitCreate} className="text-accent">
            <Check className="w-3 h-3" />
          </button>
          <button onClick={() => setCreatingType(null)} className="text-red-400">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Files Tree */}
      <div className="flex-1 overflow-y-auto py-1 px-1">
        {files.length === 0 ? (
          <div className="p-4 text-center text-xs text-text-muted font-mono">
            No files in workspace
          </div>
        ) : (
          renderTreeNodes(tree)
        )}
      </div>
    </div>
  );
}
