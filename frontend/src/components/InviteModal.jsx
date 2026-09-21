import React, { useState } from 'react';
import { X, Copy, Check, UserPlus, Shield, Clock, Users, Trash2 } from 'lucide-react';
import { workspaceApi } from '../api/workspace';
import RoleBadge from './RoleBadge';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border border-slate-800 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Collaborators & Sharing</h3>
              <p className="text-xs text-slate-400 font-mono">{workspace?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 my-4">
          <button
            onClick={() => setActiveTab('invite')}
            className={`pb-2 px-3 text-xs font-semibold transition-colors border-b-2 ${
              activeTab === 'invite'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Invite Link
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-2 px-3 text-xs font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'members'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Invite Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('EDITOR')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'EDITOR'
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-white ring-1 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <p className="text-xs font-bold text-emerald-400">Editor</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Can edit code, create/rename files</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('VIEWER')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'VIEWER'
                      ? 'border-sky-500/50 bg-sky-500/10 text-white ring-1 ring-sky-500/30'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <p className="text-xs font-bold text-sky-400">Viewer</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Read-only code inspection & chat</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Link Expiration
              </label>
              <select
                value={expiresInHours}
                onChange={(e) => setExpiresInHours(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value={24}>24 Hours</option>
                <option value={48}>48 Hours (2 Days)</option>
                <option value={168}>7 Days</option>
              </select>
            </div>

            <button
              onClick={handleGenerateInvite}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? 'Generating Link...' : 'Generate Expiring Link'}
            </button>

            {inviteUrl && (
              <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 block mb-1 uppercase tracking-wider">
                  Expiring Invite Link
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-300 focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex-shrink-0"
                    title="Copy link"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Members List */}
        {activeTab === 'members' && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {workspace?.members?.map((m) => (
              <div
                key={m.userId}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                    {m.displayName ? m.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{m.displayName}</p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">{m.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isOwner && m.role !== 'OWNER' ? (
                    <select
                      value={m.role}
                      onChange={(e) => onUpdateRole(m.userId, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg text-xs py-1 px-2 text-slate-200 focus:outline-none"
                    >
                      <option value="EDITOR">Editor</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  ) : (
                    <RoleBadge role={m.role} />
                  )}

                  {isOwner && m.role !== 'OWNER' && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${m.displayName} from this workspace?`)) {
                          onRemoveMember(m.userId);
                        }
                      }}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
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
    </div>
  );
}
