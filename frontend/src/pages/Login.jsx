import React from 'react';
import Navbar from '../components/Navbar';
import LoginForm from '../components/auth/LoginForm';
import { Terminal, ShieldCheck, Zap, Users } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export default function Login() {
  return (
    <div className="min-h-screen bg-surface-canvas text-text-primary flex flex-col selection:bg-accent-subtle selection:text-accent-base">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          {/* Left Column: Form */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full">
            <LoginForm />
          </div>

          {/* Right Column: Split Showcase Panel */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 text-left pl-6 border-l border-border-subtle">
            <div>
              <Badge variant="accent" size="sm" className="mb-3">
                REAL-TIME WORKBENCH
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                Instant collaboration. <br />
                Zero setup required.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                Sign in to resume editing your distributed workspaces, review concurrent pull requests, and pair program with teammates.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-surface-raised border border-border-subtle flex items-start gap-3">
                <div className="p-1.5 rounded-sm bg-surface-subtle text-accent border border-border-subtle flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-text-primary">Sub-Millisecond Synchronization</h3>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                    Binary CRDT deltas over WebSocket with automatic Redis Pub/Sub cluster broadcast.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-raised border border-border-subtle flex items-start gap-3">
                <div className="p-1.5 rounded-sm bg-surface-subtle text-accent border border-border-subtle flex-shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-text-primary">Live Presence & Follow Mode</h3>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                    Color-coded remote carets, selection highlights, and in-context workspace chat.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-raised border border-border-subtle flex items-start gap-3">
                <div className="p-1.5 rounded-sm bg-surface-subtle text-accent border border-border-subtle flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-text-primary">Cryptographic Security</h3>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                    RS256 JWT tokens with automatic rotating refresh tokens and httpOnly cookie storage.
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
