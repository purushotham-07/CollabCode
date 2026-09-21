import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Share2, Trash2, Terminal } from 'lucide-react';
import RoleBadge from './RoleBadge';

export default function WorkspaceHeader({
  workspace,
  myRole,
  onOpenInvite,
  onDeleteWorkspace,
}) {
  const isOwner = myRole === 'OWNER';
  const canInvite = myRole === 'OWNER' || myRole === 'EDITOR';

  return (
    <header className="h-11 border-b border-border-subtle bg-surface-subtle px-3.5 flex items-center justify-between select-none">
      {/* Left: Back Link & Workspace Name */}
      <div className="flex items-center gap-2.5">
        <Link
          to="/dashboard"
          title="Back to Dashboard"
          className="p-1 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors duration-120"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>

        <div className="h-3.5 w-px bg-border-subtle" />

        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-accent" />
          <h2 className="text-xs font-semibold text-text-primary font-mono tracking-tight">{workspace?.name}</h2>
          <RoleBadge role={myRole} size="sm" />
        </div>
      </div>

      {/* Right: Collaborators & Actions */}
      <div className="flex items-center gap-2.5">
        {/* Collaborators Avatar Stack */}
        <div
          onClick={onOpenInvite}
          className="flex items-center gap-2 cursor-pointer p-1 rounded-sm hover:bg-surface-raised transition-colors duration-120"
          title="View members"
        >
          <div className="flex -space-x-1 overflow-hidden font-mono text-[9px]">
            {workspace?.members?.slice(0, 4).map((m, idx) => (
              <div
                key={m.userId || idx}
                className="w-5 h-5 rounded-sm bg-surface-raised border border-border-default flex items-center justify-center font-semibold text-text-secondary"
              >
                {m.displayName ? m.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            ))}
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            {workspace?.members?.length || 1} online
          </span>
        </div>

        {/* Share / Invite Button */}
        {canInvite && (
          <button
            onClick={onOpenInvite}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-accent-subtle hover:bg-accent/20 text-accent border border-accent-border text-[11px] font-mono font-medium transition-colors duration-120 cursor-pointer"
          >
            <Share2 className="w-3 h-3" />
            <span>Invite</span>
          </button>
        )}

        {/* Delete Workspace Button (Owner Only) */}
        {isOwner && (
          <button
            onClick={() => {
              if (confirm(`Permanently delete workspace "${workspace?.name}" and all its files?`)) {
                onDeleteWorkspace();
              }
            }}
            title="Delete Workspace"
            className="p-1 rounded-sm text-text-muted hover:text-red-400 hover:bg-surface-raised transition-colors duration-120"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
}
