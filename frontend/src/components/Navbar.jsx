import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X, Code2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
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
    <header className="sticky top-0 z-50 w-full apple-nav transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        {/* Apple-style Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 focus-ring rounded-md">
            <div className="w-5 h-5 rounded-md bg-[#0071e3] flex items-center justify-center text-white">
              <Code2 className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <span className="font-semibold text-xs tracking-tight text-text-primary">
              CollabCode
            </span>
          </Link>

          {/* Minimalist Apple Product Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs text-text-secondary font-normal tracking-tight">
            <a href="#overview" className="hover:text-text-primary transition-colors py-1">
              Overview
            </a>
            <a href="#studio" className="hover:text-text-primary transition-colors py-1">
              Studio
            </a>
            <a href="#security" className="hover:text-text-primary transition-colors py-1">
              Security
            </a>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-border-subtle">
              <Link
                to="/dashboard"
                className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors py-1 px-2.5 rounded-full hover:bg-surface-overlay"
              >
                Workspaces
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-surface-raised border border-border-default flex items-center justify-center text-text-primary text-xs font-medium shadow-sm">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-2.5 py-1 text-xs font-normal text-text-secondary hover:text-text-primary transition-colors"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="px-3.5 py-1 text-xs font-medium rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-sm transition-all active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1 rounded-md text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-surface-canvas border-b border-border-subtle px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-xs font-medium text-text-secondary">
            <a
              href="#overview"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-text-primary"
            >
              Overview
            </a>
            <a
              href="#studio"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-text-primary"
            >
              Studio
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-text-primary"
            >
              Security
            </a>
          </nav>

          {!isAuthenticated && (
            <div className="pt-3 border-t border-border-subtle flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 text-xs text-center rounded-full bg-surface-raised border border-border-default text-text-primary"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 text-xs text-center rounded-full bg-[#0071e3] text-white font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
