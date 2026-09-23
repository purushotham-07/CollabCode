import React from 'react';

export default function RoleBadge({ role, size = 'sm' }) {
  const isSm = size === 'sm';

  const roleConfig = {
    OWNER: {
      label: 'Owner',
      dotColor: 'bg-[#0071e3]',
    },
    EDITOR: {
      label: 'Editor',
      dotColor: 'bg-[#30d158]',
    },
    VIEWER: {
      label: 'Viewer',
      dotColor: 'bg-[#86868b]',
    },
  };

  const config = roleConfig[role] || roleConfig.VIEWER;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-surface-canvas border border-border-default font-normal text-text-secondary select-none tracking-tight transition-colors ${
        isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
}
