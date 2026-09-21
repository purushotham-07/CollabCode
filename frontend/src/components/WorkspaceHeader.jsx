import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Share2, Users, Trash2, Code2 } from 'lucide-react';
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
    <header className="h-12 border-b border-slate-800 bg-[#0d1117] px-4 flex items-center justify-between select-none">
      {/* Left: Back Link & Workspace Name */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          title="Back to Dashboard"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2.5">
          <Code2 className="w-4 h-4 text-brand-400" />
          <h2 className="text-sm font-bold text-white tracking-tight">{workspace?.name}</h2>
          <RoleBadge role={myRole} size="sm" />
        </div>
      </div>

      {/* Right: Collaborators & Actions */}
      <div className="flex items-center gap-3">
        {/* Collaborators Avatar Stack */}
        <div
          onClick={onOpenInvite}
          className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
          title="View members"
        >
          <div className="flex -space-x-1.5 overflow-hidden">
            {workspace?.members?.slice(0, 4).map((m, idx) => (
              <div
                key={m.userId || idx}
                className="w-6 h-6 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-200"
              >
                {m.displayName ? m.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            ))}
          </div>
          <span className="text-xs font-mono text-slate-400">
            {workspace?.members?.length || 1} online
          </span>
        </div>

        {/* Share / Invite Button */}
        {canInvite && (
          <button
            onClick={onOpenInvite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
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
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
