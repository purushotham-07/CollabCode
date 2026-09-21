import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useWorkspaceStore } from '../store/workspaceStore';
import {
  FolderGit2,
  Plus,
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
    <div className="min-h-screen bg-surface-canvas text-text-primary flex flex-col selection:bg-accent-subtle selection:text-accent-base">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Workspaces Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-text-primary tracking-tight">
                Workspaces
              </h1>
              <span className="text-[11px] font-mono text-text-muted px-2 py-0.5 rounded-sm bg-surface-raised border border-border-subtle">
                {workspaces.length} active
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1 font-mono">
              Signed in as <span className="text-text-secondary">{user?.displayName}</span> ({user?.email})
            </p>
          </div>

          <button
            id="create-workspace-btn"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-accent text-text-on-accent font-medium text-xs hover:opacity-90 active:scale-[0.99] transition-[opacity,transform] duration-120 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Workspace</span>
          </button>
        </div>

        {/* Workspaces Grid */}
        <div className="mt-6">
          {isLoading && workspaces.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-lg bg-surface-raised border border-border-subtle animate-pulse" />
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <div className="p-12 rounded-lg border border-dashed border-border-default bg-surface-subtle/40 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-md bg-surface-raised border border-border-default flex items-center justify-center mx-auto mb-3 text-text-muted">
                <FolderGit2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">No active workspaces</h3>
              <p className="text-xs text-text-muted mt-1 mb-5">
                Create a project to begin real-time collaborative editing with your team.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-sm bg-accent text-text-on-accent font-medium text-xs hover:opacity-90 transition-opacity duration-120 cursor-pointer"
              >
                Create First Workspace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => navigate(`/workspace/${ws.id}`)}
                  className="workbench-card group p-5 cursor-pointer border border-border-subtle hover:border-border-hover transition-colors duration-120 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="p-2 rounded-sm bg-surface-subtle border border-border-subtle text-accent">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <RoleBadge role={ws.myRole} />
                    </div>

                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors duration-120 tracking-tight">
                      {ws.name}
                    </h3>
                  </div>

                  <div className="mt-6 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Users className="w-3.5 h-3.5" />
                      <span>{ws.memberCount} {ws.memberCount === 1 ? 'member' : 'members'}</span>
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
