import React from 'react';
import {
  FileCode,
  FileJson,
  FileText,
  File,
  Folder,
  FolderOpen,
} from 'lucide-react';

export default function FileIcon({ path, isDirectory, isOpen = false, className = 'w-4 h-4' }) {
  if (isDirectory) {
    return isOpen ? (
      <FolderOpen className={`${className} text-amber-400`} />
    ) : (
      <Folder className={`${className} text-amber-400`} />
    );
  }

  const ext = path.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'js':
    case 'jsx':
    case 'mjs':
      return <FileCode className={`${className} text-yellow-400`} />;
    case 'ts':
    case 'tsx':
      return <FileCode className={`${className} text-blue-400`} />;
    case 'py':
      return <FileCode className={`${className} text-emerald-400`} />;
    case 'java':
      return <FileCode className={`${className} text-orange-400`} />;
    case 'html':
    case 'htm':
      return <FileCode className={`${className} text-orange-500`} />;
    case 'css':
    case 'scss':
      return <FileCode className={`${className} text-sky-400`} />;
    case 'json':
      return <FileJson className={`${className} text-amber-300`} />;
    case 'md':
    case 'markdown':
      return <FileText className={`${className} text-slate-300`} />;
    case 'sql':
      return <FileCode className={`${className} text-pink-400`} />;
    default:
      return <File className={`${className} text-slate-400`} />;
  }
}
