import React from 'react';
import { Crown, Edit3, Eye } from 'lucide-react';

export default function RoleBadge({ role, size = 'sm' }) {
  const isSm = size === 'sm';

  switch (role) {
    case 'OWNER':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 ${
            isSm ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
          }`}
        >
          <Crown className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Owner</span>
        </span>
      );
    case 'EDITOR':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${
            isSm ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
          }`}
        >
          <Edit3 className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Editor</span>
        </span>
      );
    case 'VIEWER':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 ${
            isSm ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
          }`}
        >
          <Eye className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Viewer</span>
        </span>
      );
  }
}
