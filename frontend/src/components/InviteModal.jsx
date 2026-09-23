import React, { useState } from 'react';
import { X, Copy, Check, UserPlus, Users, Trash2 } from 'lucide-react';
import { workspaceApi } from '../api/workspace';
import RoleBadge from './RoleBadge';
import ConfirmModal from './ui/ConfirmModal';

export default function InviteModal({
  workspace,
  isOpen,
  onClose,
  onUpdateRole,
  onRemoveMember,
  isOwner = false,
}) {
  const [role, setRole] = useState('EDITOR');
  const [expiresInHours, setExpiresInHours] = useState(48);
  const [inviteUrl, setInviteUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('invite'); // 'invite' | 'members'
  const [memberToRemove, setMemberToRemove] = useState(null);

  if (!isOpen) return null;

  const handleGenerateInvite = async () => {
    setIsGenerating(true);
    try {
      const data = await workspaceApi.createInvite(workspace.id, {
        role,
        expiresInHours: Number(expiresInHours),
        maxUses: 0,
      });
      setInviteUrl(data.inviteUrl);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to generate invitation link');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="relative w-full max-w-lg rounded-lg bg-surface-raised border border-border-default p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-sm bg-surface-subtle text-accent border border-border-subtle">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Collaborators & Access</h3>
              <p className="text-[11px] text-text-muted font-mono">{workspace?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors duration-120"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border-subtle my-4">
          <button
            onClick={() => setActiveTab('invite')}
            className={`pb-2 px-3 text-xs font-mono font-medium transition-colors border-b-2 ${
              activeTab === 'invite'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            Create Invite Link
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-2 px-3 text-xs font-mono font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'members'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Members ({workspace?.members?.length || 1})</span>
          </button>
        </div>

        {/* Tab 1: Create Invite */}
        {activeTab === 'invite' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-medium uppercase tracking-wider text-text-secondary mb-1.5">
                Invite Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('EDITOR')}
                  className={`p-3 rounded-md border text-left transition-colors duration-120 ${
                    role === 'EDITOR'
                      ? 'border-accent bg-accent-subtle text-text-primary'
                      : 'border-border-default bg-surface-canvas text-text-muted hover:bg-surface-subtle'
                  }`}
                >
                  <p className="text-xs font-semibold text-accent">Editor</p>
                  <p className="text-[11px] text-text-muted mt-0.5 font-sans">Full edit permissions & file management</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('VIEWER')}
                  className={`p-3 rounded-md border text-left transition-colors duration-120 ${
                    role === 'VIEWER'
                      ? 'border-accent bg-accent-subtle text-text-primary'
                      : 'border-border-default bg-surface-canvas text-text-muted hover:bg-surface-subtle'
                  }`}
                >
                  <p className="text-xs font-semibold text-text-secondary">Viewer</p>
                  <p className="text-[11px] text-text-muted mt-0.5 font-sans">Read-only code inspection & chat</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-medium uppercase tracking-wider text-text-secondary mb-1.5">
                Link Expiration
              </label>
              <select
                value={expiresInHours}
                onChange={(e) => setExpiresInHours(e.target.value)}
                className="w-full bg-surface-canvas border border-border-default rounded-md px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent"
              >
                <option value={24}>24 Hours</option>
                <option value={48}>48 Hours (2 Days)</option>
                <option value={168}>7 Days</option>
              </select>
            </div>

            <button
              onClick={handleGenerateInvite}
              disabled={isGenerating}
              className="w-full py-2 px-4 rounded-sm bg-accent text-text-on-accent font-medium text-xs hover:opacity-90 active:scale-[0.99] transition-[opacity,transform] duration-120 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? 'Generating Link...' : 'Generate Expiring Link'}
            </button>

            {inviteUrl && (
              <div className="mt-3 p-3 rounded-md bg-surface-canvas border border-border-default">
                <span className="text-[10px] font-mono text-text-muted block mb-1 uppercase tracking-wider">
                  Expiring Invite Link
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="w-full bg-surface-subtle border border-border-subtle rounded-sm px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-sm bg-surface-raised border border-border-default hover:bg-surface-overlay text-text-primary transition-colors duration-120 flex-shrink-0"
                    title="Copy link"
                  >
                    {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Members List */}
        {activeTab === 'members' && (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {workspace?.members?.map((m) => (
              <div
                key={m.userId}
                className="flex items-center justify-between p-2.5 rounded-md bg-surface-subtle border border-border-subtle"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-sm bg-surface-raised border border-border-default flex items-center justify-center text-xs font-mono font-medium text-text-secondary">
                    {m.displayName ? m.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">{m.displayName}</p>
                    <p className="text-[10px] text-text-muted font-mono truncate">{m.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isOwner && m.role !== 'OWNER' ? (
                    <select
                      value={m.role}
                      onChange={(e) => onUpdateRole(m.userId, e.target.value)}
                      className="bg-surface-canvas border border-border-default rounded-sm text-xs py-1 px-2 text-text-primary focus:outline-none"
                    >
                      <option value="EDITOR">Editor</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  ) : (
                    <RoleBadge role={m.role} />
                  )}

                  {isOwner && m.role !== 'OWNER' && (
                    <button
                      onClick={() => setMemberToRemove(m)}
                      className="p-1 text-text-muted hover:text-red-400 transition-colors duration-120 cursor-pointer"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(memberToRemove)}
        onClose={() => setMemberToRemove(null)}
        onConfirm={() => {
          if (memberToRemove) {
            onRemoveMember(memberToRemove.userId);
            setMemberToRemove(null);
          }
        }}
        title="Remove Member"
        message={`Are you sure you want to remove ${memberToRemove?.displayName} from this workspace?`}
        confirmText="Remove"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
