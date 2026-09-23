import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Share2, Trash2, Terminal, Command, MessageSquare, HelpCircle } from 'lucide-react';
import RoleBadge from './RoleBadge';
import { Kbd } from './ui/Badge';
import ConfirmModal from './ui/ConfirmModal';

export default function WorkspaceHeader({
  workspace,
  myRole,
  onOpenInvite,
  onDeleteWorkspace,
  onOpenCommandPalette,
  onToggleChat,
  isChatOpen = false,
  unreadCount = 0,
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const isOwner = myRole === 'OWNER';
  const canInvite = myRole === 'OWNER' || myRole === 'EDITOR';

  return (
    <header className="h-11 border-b border-border-subtle bg-surface-subtle px-3.5 flex items-center justify-between select-none">
      {/* Left: Breadcrumbs & Workspace Title */}
      <div className="flex items-center gap-2">
        <Link
          to="/dashboard"
          title="Back to Dashboard"
          className="p-1 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors duration-fast"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>

        <div className="h-3.5 w-px bg-border-subtle" />

        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-text-muted font-mono hidden sm:inline">workspaces /</span>
          <h2 className="text-xs font-semibold text-text-primary font-mono tracking-tight">
            {workspace?.name}
          </h2>
          <RoleBadge role={myRole} size="sm" />
        </div>
      </div>

      {/* Right: Actions, Palette Trigger, Chat Toggle, Collaborators */}
      <div className="flex items-center gap-2">
        {/* Command Palette Trigger */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            title="Open Command Palette (Ctrl+K / Cmd+K)"
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-sm bg-surface-canvas border border-border-default text-text-muted hover:text-text-primary hover:border-border-hover text-[11px] font-mono transition-colors"
          >
            <Command className="w-3 h-3" />
            <span>Search</span>
            <Kbd>K</Kbd>
          </button>
        )}

        {/* Collaborators Avatar Stack */}
        <div
          onClick={onOpenInvite}
          className="flex items-center gap-1.5 cursor-pointer p-1 rounded-sm hover:bg-surface-raised transition-colors"
          title="View and manage members"
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
          <span className="text-[11px] font-mono text-text-muted hidden md:inline">
            {workspace?.members?.length || 1} online
          </span>
        </div>

        {/* Share / Invite Button */}
        {canInvite && (
          <button
            onClick={onOpenInvite}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-accent-subtle hover:bg-accent/20 text-accent border border-accent-border text-[11px] font-mono font-medium transition-colors cursor-pointer"
          >
            <Share2 className="w-3 h-3" />
            <span>Invite</span>
          </button>
        )}

        {/* Chat Panel Toggle */}
        {onToggleChat && (
          <button
            onClick={onToggleChat}
            title="Toggle Workspace Chat"
            className={`p-1.5 rounded-sm relative text-xs transition-colors ${
              isChatOpen
                ? 'bg-surface-active text-accent'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-raised'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {unreadCount > 0 && !isChatOpen && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent" />
            )}
          </button>
        )}

        {/* Delete Workspace Button (Owner Only) */}
        {isOwner && (
          <button
            onClick={() => setIsDeleteOpen(true)}
            title="Delete Workspace"
            className="p-1 rounded-sm text-text-muted hover:text-status-danger hover:bg-surface-raised transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          setIsDeleteOpen(false);
          onDeleteWorkspace();
        }}
        title="Delete Workspace"
        message={`Are you sure you want to permanently delete workspace "${workspace?.name}" and all its files? This action cannot be undone.`}
        confirmText="Delete Workspace"
        cancelText="Cancel"
        isDestructive={true}
      />
    </header>
  );
}
