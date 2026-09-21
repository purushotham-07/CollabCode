import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { FolderGit2, Plus, Terminal, Users, Cpu, ShieldCheck, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Welcome back, {user?.displayName || 'Developer'}
              </h1>
              <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1 font-mono">
              Signed in as <span className="text-slate-200">{user?.email}</span> • Session authenticated with RS256 JWT
            </p>
          </div>

          <button
            onClick={() => alert('Workspaces and multi-file tree will be initialized in Phase 2!')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-600 hover:to-emerald-700 text-slate-950 font-bold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-200 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Workspace</span>
          </button>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          <div className="p-5 rounded-xl glass-panel border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>AUTH STATUS</span>
              <ShieldCheck className="w-4 h-4 text-brand-400" />
            </div>
            <p className="text-xl font-bold text-white">Active & Verified</p>
            <p className="text-xs text-slate-500 mt-1">Rotating refresh cookies enabled</p>
          </div>

          <div className="p-5 rounded-xl glass-panel border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>CRDT SYNC ENGINE</span>
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-white">Yjs Binary Protocol</p>
            <p className="text-xs text-slate-500 mt-1">Ready for WebSocket stream</p>
          </div>

          <div className="p-5 rounded-xl glass-panel border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>CLUSTER TOPOLOGY</span>
              <Cpu className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-xl font-bold text-white">3-Node Redis Fanout</p>
            <p className="text-xs text-slate-500 mt-1">Nginx load-balanced backend</p>
          </div>

          <div className="p-5 rounded-xl glass-panel border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>DATA PERSISTENCE</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xl font-bold text-white">MongoDB Replica Set</p>
            <p className="text-xs text-slate-500 mt-1">Append-only doc updates</p>
          </div>
        </div>

        {/* Workspaces List Placeholder */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-white mb-4">Your Workspaces</h2>
          <div className="p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <FolderGit2 className="w-7 h-7 text-brand-400" />
            </div>
            <h3 className="text-base font-semibold text-white">No active workspaces yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-6">
              In Phase 2, you'll be able to create collaborative projects, manage file trees, and invite editors with expiring links.
            </p>
            <button
              onClick={() => alert('Phase 2 implementation begins immediately after Phase 1 verification!')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
            >
              Prepare Phase 2 Workspace
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
