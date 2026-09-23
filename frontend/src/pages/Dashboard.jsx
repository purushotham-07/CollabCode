import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useWorkspaceStore } from '../store/workspaceStore';
import {
  FolderGit2,
  Plus,
  Clock,
  Users,
  Search,
  X,
  Folder,
} from 'lucide-react';
import RoleBadge from '../components/RoleBadge';
import CreateWorkspaceModal from '../components/CreateWorkspaceModal';

export default function Dashboard() {
  const { user } = useAuth();
  const { workspaces, fetchWorkspaces, createWorkspace, isLoading } = useWorkspaceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreateWorkspace = async (name) => {
    const newWs = await createWorkspace(name);
    navigate(`/workspace/${newWs.id}`);
  };

  const filteredWorkspaces = useMemo(() => {
    if (!searchQuery.trim()) return workspaces;
    return workspaces.filter((ws) =>
      ws.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [workspaces, searchQuery]);

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
    <div className="min-h-screen bg-surface-canvas text-text-primary flex flex-col selection:bg-[#0071e3]/30 selection:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Apple-style Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
                Workspaces
              </h1>
              <span className="text-xs font-mono text-text-secondary px-2.5 py-0.5 rounded-full bg-surface-raised border border-border-default">
                {workspaces.length} active
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1.5">
              Signed in as <span className="text-text-primary font-medium">{user?.displayName || 'Developer'}</span> ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search filter input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workspaces..."
                className="pl-9 pr-8 py-2 rounded-full bg-surface-raised border border-border-default text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-[#0071e3] w-48 sm:w-60 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              id="create-workspace-btn"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition-all shadow-md shadow-[#0071e3]/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Workspace</span>
            </button>
          </div>
        </div>

        {/* Workspaces Grid */}
        <div className="mt-8">
          {isLoading && workspaces.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="apple-card p-6 animate-pulse space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-surface-overlay" />
                  <div className="w-2/3 h-5 rounded-lg bg-surface-overlay" />
                  <div className="w-1/2 h-3 rounded-lg bg-surface-overlay" />
                </div>
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <div className="apple-card p-12 text-center max-w-md mx-auto my-12">
              <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3] mx-auto mb-4">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">No active workspaces</h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                Create your first cloud workspace to begin organizing files and collaborating in the studio.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition-all shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Workspace</span>
              </button>
            </div>
          ) : filteredWorkspaces.length === 0 ? (
            <div className="apple-card p-10 text-center max-w-md mx-auto my-12">
              <Search className="w-6 h-6 text-text-muted mx-auto mb-3" />
              <h3 className="text-base font-semibold text-text-primary mb-1">No matching workspaces</h3>
              <p className="text-xs text-text-secondary mb-4">
                No workspaces match "{searchQuery}".
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-1.5 rounded-full bg-surface-raised border border-border-default hover:bg-surface-overlay text-xs text-text-primary"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredWorkspaces.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => navigate(`/workspace/${ws.id}`)}
                  className="apple-card p-6 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3] group-hover:scale-105 transition-transform">
                        <Folder className="w-5 h-5 fill-[#0071e3]/20" />
                      </div>
                      <RoleBadge role={ws.myRole} />
                    </div>

                    <h3 className="text-base font-semibold text-text-primary group-hover:text-[#0071e3] transition-colors tracking-tight">
                      {ws.name}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                      {ws.description || 'Cloud workspace project'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-text-muted" />
                      <span className="font-mono text-[11px]">
                        {ws.memberCount || 1} {ws.memberCount === 1 ? 'member' : 'members'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-text-muted font-mono text-[11px]">
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
