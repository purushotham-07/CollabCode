import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Terminal } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-sm bg-surface-raised border border-border-default text-accent group-hover:border-accent transition-colors duration-120">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-text-primary">
              CollabCode
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted -mt-0.5">
              CRDT Workbench
            </span>
          </div>
        </Link>

        {/* Right Navigation */}
        <nav className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors duration-120"
              >
                Workspaces
              </Link>
              <div className="flex items-center gap-2.5 pl-2.5 border-l border-border-subtle">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-7 h-7 rounded-sm border border-border-default object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-sm bg-surface-raised border border-border-default flex items-center justify-center text-text-secondary text-xs font-mono font-medium">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                  </div>
                )}
                <span className="text-xs text-text-primary font-medium hidden sm:inline-block">
                  {user.displayName}
                </span>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors duration-120"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors duration-120 px-3 py-1.5 rounded-sm hover:bg-surface-raised"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-medium px-3 py-1.5 rounded-sm bg-accent text-text-on-accent hover:opacity-90 active:scale-[0.99] transition-[opacity,transform] duration-120"
              >
                Start Free
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
