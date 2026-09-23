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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-surface-raised border border-border-default p-7 shadow-2xl transition-colors duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 text-[#0071e3] flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary tracking-tight">Create Workspace</h3>
              <p className="text-xs text-text-secondary">Set up your cloud development project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Workspace Name
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. cloud-algorithms-lab"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-2.5 bg-surface-subtle border border-border-default rounded-xl text-text-primary placeholder-text-muted text-xs focus:outline-none focus:border-[#0071e3] transition-all"
            />
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-surface-canvas hover:bg-surface-active border border-border-default text-xs font-medium text-text-secondary hover:text-text-primary transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs shadow-md shadow-[#0071e3]/20 flex items-center gap-1.5 disabled:opacity-60 cursor-pointer active:scale-95 transition-all"
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
