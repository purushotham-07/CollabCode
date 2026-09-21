import React, { useState } from 'react';
import { X, FolderPlus, Loader2, ArrowRight } from 'lucide-react';

export default function CreateWorkspaceModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }
    if (name.trim().length < 2) {
      setError('Workspace name must be at least 2 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await onCreate(name.trim());
      setName('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create workspace');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="relative w-full max-w-md rounded-lg bg-surface-raised border border-border-default p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-sm bg-surface-subtle text-accent border border-border-subtle">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Create New Workspace</h3>
              <p className="text-[11px] text-text-muted font-mono">Initialize collaborative document root</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors duration-120"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-[11px] font-mono font-medium uppercase tracking-wider text-text-secondary mb-1.5">
              Workspace Name
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Distributed-Algorithm-Lab"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3 py-2 bg-surface-canvas border border-border-default rounded-md text-text-primary placeholder-text-muted text-xs focus:outline-none focus:border-accent transition-colors duration-120"
            />
            {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-sm bg-surface-subtle hover:bg-surface-overlay border border-border-default text-text-secondary text-xs font-medium transition-colors duration-120"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-1.5 rounded-sm bg-accent text-text-on-accent font-medium text-xs hover:opacity-90 active:scale-[0.99] transition-[opacity,transform] duration-120 flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Create Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
