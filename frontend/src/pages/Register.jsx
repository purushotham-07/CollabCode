import React from 'react';
import Navbar from '../components/Navbar';
import RegisterForm from '../components/auth/RegisterForm';
import { Terminal, Check, FolderGit2, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export default function Register() {
  return (
    <div className="min-h-screen bg-surface-canvas text-text-primary flex flex-col selection:bg-accent-subtle selection:text-accent-base">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          {/* Left Column: Form */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full">
            <RegisterForm />
          </div>

          {/* Right Column: Split Showcase Panel */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 text-left pl-6 border-l border-border-subtle">
            <div>
              <Badge variant="accent" size="sm" className="mb-3">
                FREE DEVELOPER ACCOUNT
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                Everything you need to <br />
                build together.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                Join thousands of engineers pair-programming in real time with guaranteed document consistency.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-surface-raised border border-border-subtle flex items-start gap-3">
                <div className="p-1.5 rounded-sm bg-surface-subtle text-accent border border-border-subtle flex-shrink-0 mt-0.5">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-text-primary">Unlimited Workspaces & Files</h3>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                    Create hierarchical directories, open multiple editor tabs, and edit source files simultaneously.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-raised border border-border-subtle flex items-start gap-3">
                <div className="p-1.5 rounded-sm bg-surface-subtle text-accent border border-border-subtle flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-text-primary">Granular Role Permissions</h3>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                    Invite collaborators with Editor or Viewer roles. Revoke access or rotate invite links at any time.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-raised border border-border-subtle flex items-start gap-3">
                <div className="p-1.5 rounded-sm bg-surface-subtle text-accent border border-border-subtle flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-text-primary">No Infrastructure Overhead</h3>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                    Runs 100% in your browser without local server daemons, port forwarding, or SSH tunnels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
