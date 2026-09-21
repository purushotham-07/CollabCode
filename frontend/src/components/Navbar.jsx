import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Terminal, Menu, X, Github } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import ThemeToggle from './ui/ThemeToggle';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-canvas/95 backdrop-blur-sm transition-colors duration-fast">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 focus-ring rounded-sm">
            <div className="w-7 h-7 rounded-sm bg-surface-raised border border-border-default text-accent flex items-center justify-center font-mono text-sm font-bold shadow-soft-sm">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-text-primary">
              CollabCode
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs text-text-muted">
            <a
              href="#features"
              className="hover:text-text-primary transition-colors focus-ring rounded-sm py-1"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-text-primary transition-colors focus-ring rounded-sm py-1"
            >
              How It Works
            </a>
            <a
              href="#architecture"
              className="hover:text-text-primary transition-colors focus-ring rounded-sm py-1"
            >
              Architecture
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-text-primary transition-colors focus-ring rounded-sm py-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Open Source</span>
            </a>
          </nav>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-border-subtle">
              <Link
                to="/dashboard"
                className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors py-1 px-2 rounded-sm hover:bg-surface-raised"
              >
                Workspaces
              </Link>
              <div className="flex items-center gap-2">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-6 h-6 rounded-sm border border-border-default object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-sm bg-surface-raised border border-border-default flex items-center justify-center text-text-primary text-xs font-mono font-medium">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Start Free
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors focus-ring"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-border-subtle bg-surface-raised p-4 space-y-3 animate-in slide-in-from-top-2 duration-fast">
          <nav className="flex flex-col space-y-2 text-xs text-text-secondary">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-text-primary"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-text-primary"
            >
              How It Works
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-text-primary"
            >
              Architecture & Benchmarks
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 hover:text-text-primary flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
            </a>
          </nav>

          {!isAuthenticated && (
            <div className="pt-3 border-t border-border-subtle flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">
                  Start Free
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
