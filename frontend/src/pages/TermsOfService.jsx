import React from 'react';
import Navbar from '../components/Navbar';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-surface-canvas text-text-primary flex flex-col selection:bg-accent-subtle selection:text-accent-base">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 text-left">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2.5 pb-4 border-b border-border-subtle mb-8">
          <FileText className="w-6 h-6 text-accent" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-text-primary">
              Terms of Service
            </h1>
            <p className="text-xs text-text-muted font-mono">Effective Date: September 21, 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-xs text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing CollabCode, creating collaborative workspaces, or inviting collaborators, you agree to comply with these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">2. Acceptable Use Policy</h2>
            <p>
              CollabCode is intended for software development, code editing, and technical team collaboration. You may not use the service to transmit malware, attempt denial-of-service against the CRDT synchronization infrastructure, or circumvent access control roles.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">3. Role-Based Permissions</h2>
            <p>
              Workspace owners retain full authority over workspace members and file trees. Inviting members grants them either Editor or Viewer privileges as configured by the workspace administrator.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">4. Service Availability & Warranties</h2>
            <p>
              CollabCode is provided "as is" with high-availability distributed architecture (multi-node Redis Pub/Sub, MongoDB replica sets, and Nginx load balancing). We continuously strive for 99.9% uptime.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border-subtle py-6 bg-surface-canvas text-center text-xs text-text-muted">
        © {new Date().getFullYear()} CollabCode. All rights reserved.
      </footer>
    </div>
  );
}
