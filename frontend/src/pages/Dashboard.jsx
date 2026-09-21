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
  Terminal,
  Search,
  X,
  ArrowRight,
} from 'lucide-react';
import RoleBadge from '../components/RoleBadge';
import CreateWorkspaceModal from '../components/CreateWorkspaceModal';
import { Button } from '../components/ui/Button';
import { Skeleton, EmptyState } from '../components/ui/Tabs';
import { AvatarStack } from '../components/ui/Badge';

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

          <div className="flex items-center gap-3">
            {/* Search filter input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workspaces..."
                className="pl-8 pr-7 py-1.5 rounded-sm bg-surface-raised border border-border-default text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent w-48 sm:w-60 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <Button
              id="create-workspace-btn"
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsModalOpen(true)}
            >
              New Workspace
            </Button>
          </div>
        </div>

        {/* Workspaces Grid */}
        <div className="mt-6">
          {isLoading && workspaces.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 rounded-lg bg-surface-raised border border-border-subtle space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="w-8 h-8 rounded-sm" />
                    <Skeleton className="w-16 h-5 rounded-sm" />
                  </div>
                  <Skeleton className="w-3/4 h-5 rounded-sm mt-4" />
                  <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                    <Skeleton className="w-20 h-4 rounded-sm" />
                    <Skeleton className="w-16 h-4 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <EmptyState
              icon={<FolderGit2 className="w-5 h-5 text-accent" />}
              title="No active workspaces yet"
              description="Create your first collaborative workspace to start editing code in real time with teammates."
              action={
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsModalOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Create First Workspace
                </Button>
              }
              className="max-w-md mx-auto my-12"
            />
          ) : filteredWorkspaces.length === 0 ? (
            <EmptyState
              icon={<Search className="w-5 h-5 text-text-muted" />}
              title="No matching workspaces"
              description={`No workspaces found matching "${searchQuery}". Try a different search term.`}
              action={
                <Button variant="secondary" size="sm" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              }
              className="max-w-md mx-auto my-12"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkspaces.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => navigate(`/workspace/${ws.id}`)}
                  className="workbench-card group p-5 cursor-pointer border border-border-subtle hover:border-border-hover transition-colors duration-fast flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="p-2 rounded-sm bg-surface-subtle border border-border-subtle text-accent group-hover:border-accent transition-colors">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <RoleBadge role={ws.myRole} />
                    </div>

                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors duration-fast tracking-tight">
                      {ws.name}
                    </h3>
                  </div>

                  <div className="mt-6 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
                    <div className="flex items-center gap-2">
                      <AvatarStack
                        users={ws.members || [{ displayName: user?.displayName }]}
                        max={3}
                        size="sm"
                      />
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
