import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useWorkspaceStore } from '../store/workspaceStore';
import {
  FolderGit2,
  Plus,
  ArrowRight,
  Sparkles,
  Clock,
  Users,
  Terminal,
} from 'lucide-react';
import RoleBadge from '../components/RoleBadge';
import CreateWorkspaceModal from '../components/CreateWorkspaceModal';

export default function Dashboard() {
  const { user } = useAuth();
  const { workspaces, fetchWorkspaces, createWorkspace, isLoading } = useWorkspaceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreateWorkspace = async (name) => {
    const newWs = await createWorkspace(name);
    navigate(`/workspace/${newWs.id}`);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col selection:bg-brand-500/30 selection:text-brand-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Workspaces
              </h1>
              <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1 font-mono">
              Welcome back, <span className="text-slate-200">{user?.displayName}</span> ({user?.email})
            </p>
          </div>

          <button
            id="create-workspace-btn"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-600 hover:to-emerald-700 text-slate-950 font-bold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-200 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Workspace</span>
          </button>
        </div>

        {/* Workspaces Grid */}
        <div className="mt-8">
          {isLoading && workspaces.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 rounded-2xl glass-panel border border-slate-800" />
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <div className="p-16 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <FolderGit2 className="w-7 h-7 text-brand-400" />
              </div>
              <h3 className="text-lg font-bold text-white">No active workspaces</h3>
              <p className="text-sm text-slate-400 mt-1 mb-6">
                Create a project to start real-time multi-file collaboration with your team.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs shadow-lg shadow-brand-500/20 transition-all cursor-pointer"
              >
                Create First Workspace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => navigate(`/workspace/${ws.id}`)}
                  className="group relative p-6 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-0.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-brand-400 group-hover:text-brand-300 transition-colors">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <RoleBadge role={ws.myRole} />
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors tracking-tight">
                      {ws.name}
                    </h3>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Users className="w-3.5 h-3.5" />
                      <span>{ws.memberCount} {ws.memberCount === 1 ? 'member' : 'members'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(ws.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />
    </div>
  );
}
