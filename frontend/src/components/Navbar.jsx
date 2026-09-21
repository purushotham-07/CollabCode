import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, LogOut, User, Terminal } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 text-slate-950 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <Terminal className="w-5 h-5 font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              CollabCode
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-semibold -mt-1">
              Real-Time CRDT
            </span>
          </div>
        </Link>

        {/* Right Navigation */}
        <nav className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Workspaces
              </Link>
              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full ring-2 ring-emerald-500/40 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-semibold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                )}
                <span className="text-sm text-slate-200 font-medium hidden sm:inline-block">
                  {user.displayName}
                </span>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/60 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-900"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-slate-950 font-semibold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
