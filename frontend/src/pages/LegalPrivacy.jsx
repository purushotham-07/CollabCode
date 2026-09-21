import React from 'react';
import Navbar from '../components/Navbar';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LegalPrivacy() {
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
          <ShieldCheck className="w-6 h-6 text-accent" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-text-primary">
              Privacy Policy
            </h1>
            <p className="text-xs text-text-muted font-mono">Effective Date: September 21, 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-xs text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">1. Overview</h2>
            <p>
              CollabCode is committed to protecting developer privacy. We only collect the minimal information necessary to deliver real-time collaborative editing, synchronize CRDT state deltas, and authenticate team workspaces.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">2. Information We Process</h2>
            <ul className="list-disc pl-5 space-y-1 text-text-muted">
              <li><strong>Account Credentials:</strong> Email addresses and display names for authentication and workspace presence tags.</li>
              <li><strong>Document Content:</strong> Ephemeral CRDT document deltas synchronized via WebSockets and compacted to MongoDB replica sets.</li>
              <li><strong>Telemetry & Presence:</strong> Real-time cursor coordinates and presence pings retained only in active memory during editing sessions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">3. Cookies & Session Storage</h2>
            <p>
              We use secure, HTTP-only cookies strictly for RS256 JWT refresh token rotation. We do not employ third-party tracking scripts, advertising beacons, or cross-site fingerprinting technologies.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">4. Data Deletion & Ownership</h2>
            <p>
              Workspaces and document trees belong entirely to the project owner. Deleting a workspace immediately purges all associated document deltas, snapshots, and invite tokens.
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
