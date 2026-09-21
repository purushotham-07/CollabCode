import React from 'react';
import { Crown, Edit3, Eye } from 'lucide-react';

export default function RoleBadge({ role, size = 'sm' }) {
  const isSm = size === 'sm';

  switch (role) {
    case 'OWNER':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider font-semibold rounded-sm bg-amber-500/10 text-amber-400 border border-amber-500/30 ${
            isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
          }`}
        >
          <Crown className={isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
          <span>Owner</span>
        </span>
      );
    case 'EDITOR':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider font-semibold rounded-sm bg-accent-subtle text-accent border border-accent-border ${
            isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
          }`}
        >
          <Edit3 className={isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
          <span>Editor</span>
        </span>
      );
    case 'VIEWER':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider font-semibold rounded-sm bg-surface-subtle text-text-secondary border border-border-default ${
            isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
          }`}
        >
          <Eye className={isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
          <span>Viewer</span>
        </span>
      );
  }
}
