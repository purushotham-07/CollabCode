import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  ChevronRight,
  Shield,
  Zap,
  Play,
  Users,
  Check,
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Landing() {

  return (
    <div className="min-h-screen bg-surface-canvas text-text-primary flex flex-col selection:bg-[#0071e3]/30 selection:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION - Apple Product Design */}
        {/* ========================================================================= */}
        <section id="overview" className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Apple Product Category Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-raised border border-border-default text-xs font-medium text-text-secondary mb-6 shadow-sm">
              <span>CollabCode Studio</span>
              <span className="text-text-muted">•</span>
              <span className="text-text-primary font-medium">Cloud Development</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-text-primary leading-[1.08] mb-5">
              Code together. <br />
              <span className="apple-headline-gradient">In real time.</span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto font-normal leading-relaxed tracking-tight mb-8">
              A collaborative cloud development environment designed for engineering teams. Write, review, and execute code with sub-millisecond precision.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs sm:text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Get Started</span>
                <ChevronRight className="w-4 h-4 stroke-[2.2]" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-surface-raised hover:bg-surface-overlay text-text-primary text-xs sm:text-sm font-medium transition-all border border-border-default flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PRODUCT CAPABILITIES - Apple Bento Style */}
        {/* ========================================================================= */}
        <section id="studio" className="py-20 border-t border-border-subtle">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0071e3] mb-3">
                Capabilities
              </h2>
              <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
                Everything required for modern development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="apple-card p-7 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3] mb-5">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary tracking-tight mb-2">
                    Monaco Editor Integration
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Built upon the VS Code editor core with syntax highlighting, multi-tab file navigation, line counts, and intelligent formatting across modern languages.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border-subtle text-[11px] text-text-secondary flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#30d158]" />
                  <span>TypeScript, Python, JavaScript, JSON, Java</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="apple-card p-7 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#30d158]/10 border border-[#30d158]/20 flex items-center justify-center text-[#30d158] mb-5">
                    <Play className="w-5 h-5 text-[#30d158]" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary tracking-tight mb-2">
                    In-Browser Execution Sandbox
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Test and execute JavaScript snippets immediately inside an isolated browser runtime. Capture console logs and debug outputs in real time.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border-subtle text-[11px] text-text-secondary flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#30d158]" />
                  <span>Instant console output & error tracing</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="apple-card p-7 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#ff9f0a]/10 border border-[#ff9f0a]/20 flex items-center justify-center text-[#ff9f0a] mb-5">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary tracking-tight mb-2">
                    Workspace Collaboration & RBAC
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Create independent workspaces, manage hierarchical file structures, and assign Owner, Editor, or Viewer roles with secure invite links.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border-subtle text-[11px] text-text-secondary flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#30d158]" />
                  <span>Role-based access & secure permissions</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECURITY & ARCHITECTURE */}
        {/* ========================================================================= */}
        <section id="security" className="py-20 border-t border-border-subtle">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="w-10 h-10 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3] mx-auto mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight mb-3">
              Cryptographic Token Security
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed mb-8">
              Authentication is secured via RS256 asymmetric signing, automatic refresh token rotation, and BCrypt password encryption. Designed for reliability on modern cloud infrastructure.
            </p>

            <div className="inline-flex items-center gap-6 px-6 py-2.5 rounded-full bg-surface-raised border border-border-default text-xs text-text-secondary shadow-sm">
              <span>RS256 JWT</span>
              <span className="text-text-muted">•</span>
              <span>Encrypted Storage</span>
              <span className="text-text-muted">•</span>
              <span>Stateless REST API</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CALL TO ACTION */}
        {/* ========================================================================= */}
        <section className="py-20 text-center border-t border-border-subtle">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-3">
              Ready to start coding?
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mb-7 max-w-md mx-auto">
              Launch a project in seconds or enter an instant test session.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-surface-raised hover:bg-surface-overlay text-text-primary text-xs sm:text-sm font-medium transition-all border border-border-default active:scale-95 shadow-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Apple-style Footer */}
      <footer className="border-t border-border-subtle py-8 text-center text-xs text-text-muted">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>Copyright © CollabCode Studio. All rights reserved.</div>
          <div className="flex items-center gap-6 text-text-secondary">
            <Link to="/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-text-primary transition-colors">Terms of Use</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
