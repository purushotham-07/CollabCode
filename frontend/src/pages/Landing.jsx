import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Users, Cpu, Shield, GitBranch, ArrowRight, Play, Check } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface-canvas text-text-primary flex flex-col selection:bg-accent-subtle selection:text-accent-base">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-16 pb-24 border-b border-border-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-border-default bg-surface-raised text-text-secondary text-xs font-mono mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>DISTRIBUTED CRDT ENGINE · YJS V13</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-text-primary max-w-4xl mx-auto leading-tight">
              Real-time collaborative editing. <br />
              <span className="text-accent">Zero merge conflicts.</span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Multi-file collaborative workspaces powered by Yjs binary state vectors,
              Redis Pub/Sub inter-node fanout, and append-only MongoDB compaction.
            </p>

            {/* Call to Action */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                id="hero-cta-btn"
                className="w-full sm:w-auto px-6 py-3 rounded-md bg-accent text-text-on-accent font-medium text-sm hover:opacity-90 active:scale-[0.99] transition-[opacity,transform] duration-120 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-md border border-border-default bg-surface-raised hover:bg-surface-overlay text-text-primary font-medium text-sm transition-colors duration-120 flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 text-accent fill-accent" />
                <span>Sign In to Workspaces</span>
              </Link>
            </div>

            {/* Architectural Specifications Strip */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-text-muted">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent" />
                <span>Stateless WebSocket Replicas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent" />
                <span>Binary CRDT State Vectors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent" />
                <span>RS256 JWT Rotation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent" />
                <span>Sub-15ms Local Echo</span>
              </div>
            </div>

            {/* Interactive Workspace Preview Simulation */}
            <div className="mt-14 max-w-5xl mx-auto rounded-lg overflow-hidden border border-border-subtle bg-surface-canvas shadow-xl text-left">
              {/* Fake Window Title Bar */}
              <div className="h-9 bg-surface-subtle border-b border-border-subtle px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-border-default" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border-default" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border-default" />
                  <span className="ml-3 text-xs font-mono text-text-muted">
                    collabcode-workspace / src / crdt-sync.ts
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5 overflow-hidden font-mono text-[10px]">
                    <span className="inline-flex h-5 w-5 rounded-sm bg-surface-raised border border-border-default text-text-primary items-center justify-center font-bold">
                      AL
                    </span>
                    <span className="inline-flex h-5 w-5 rounded-sm bg-surface-raised border border-border-default text-text-primary items-center justify-center font-bold">
                      BO
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-accent bg-accent-subtle px-2 py-0.5 rounded-sm border border-accent-border">
                    2 Peers Connected
                  </span>
                </div>
              </div>

              {/* Code Editor Mock Screen */}
              <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-text-secondary grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Line Numbers + Code */}
                <div className="md:col-span-8 space-y-1">
                  <p><span className="text-text-muted mr-4 select-none">01</span><span className="text-accent">import</span> * <span className="text-accent">as</span> Y <span className="text-accent">from</span> <span className="text-text-primary">'yjs'</span>;</p>
                  <p><span className="text-text-muted mr-4 select-none">02</span><span className="text-accent">import</span> &#123; WebsocketProvider &#125; <span className="text-accent">from</span> <span className="text-text-primary">'y-websocket'</span>;</p>
                  <p><span className="text-text-muted mr-4 select-none">03</span></p>
                  <p><span className="text-text-muted mr-4 select-none">04</span><span className="text-text-muted">// Collaborative document state initialized</span></p>
                  <p><span className="text-text-muted mr-4 select-none">05</span><span className="text-text-primary font-semibold">const</span> doc = <span className="text-text-primary font-semibold">new</span> Y.Doc();</p>
                  <p className="bg-surface-raised -mx-5 px-5 py-0.5 border-l-2 border-accent">
                    <span className="text-text-muted mr-4 select-none">06</span>
                    <span className="text-text-primary font-semibold">const</span> yText = doc.getText(<span className="text-text-primary">'monaco'</span>);
                    <span className="inline-block ml-2 px-1.5 py-0.2 bg-accent text-text-on-accent font-mono text-[10px] rounded-sm">Alice</span>
                  </p>
                  <p><span className="text-text-muted mr-4 select-none">07</span>yText.observe(event =&gt; &#123;</p>
                  <p><span className="text-text-muted mr-4 select-none">08</span>  applyBinaryDelta(event.delta);</p>
                  <p><span className="text-text-muted mr-4 select-none">09</span>&#125;);</p>
                </div>

                {/* Mini Chat / Presence Sidebar Preview */}
                <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-border-subtle pt-4 md:pt-0 md:pl-4 flex flex-col justify-between text-xs">
                  <div>
                    <span className="text-text-muted font-mono uppercase text-[10px] tracking-wider block mb-3">
                      Presence & Convergence
                    </span>
                    <div className="space-y-2.5">
                      <div className="bg-surface-subtle p-2.5 rounded-md border border-border-subtle">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-text-primary font-semibold">Alice</span>
                          <span className="text-text-muted font-mono text-[10px]">10:42:01</span>
                        </div>
                        <p className="text-text-secondary font-sans text-xs">
                          CRDT delta stream converged across Node A and Node B.
                        </p>
                      </div>
                      <div className="bg-surface-subtle p-2.5 rounded-md border border-border-subtle">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-text-primary font-semibold">Bob</span>
                          <span className="text-text-muted font-mono text-[10px]">10:42:04</span>
                        </div>
                        <p className="text-text-secondary font-sans text-xs">
                          Confirmed: state vector synchronized with zero locks.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-border-subtle flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-[11px] text-text-muted font-mono">Redis channel active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section - With Layout & Paint Containment */}
        <section className="py-20 bg-surface-subtle/50 content-auto contain-paint">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">
                Architectural Foundation
              </h2>
              <p className="text-text-secondary mt-2 text-sm leading-relaxed">
                Deterministic synchronization and fault-tolerant replication designed for high-concurrency developer workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="workbench-card p-6">
                <div className="w-10 h-10 rounded-md bg-surface-subtle text-accent flex items-center justify-center mb-4 border border-border-subtle">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">CRDT Binary Vector Sync</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Real-time document convergence via binary state vectors and update deltas over raw WebSockets without sticky session dependencies.
                </p>
              </div>

              <div className="workbench-card p-6">
                <div className="w-10 h-10 rounded-md bg-surface-subtle text-accent flex items-center justify-center mb-4 border border-border-subtle">
                  <GitBranch className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">Distributed Redis Fanout</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Multiple Spring Boot backend replicas load-balanced behind Nginx. Broadcasts propagate across Redis channels with sub-millisecond inter-node latency.
                </p>
              </div>

              <div className="workbench-card p-6">
                <div className="w-10 h-10 rounded-md bg-surface-subtle text-accent flex items-center justify-center mb-4 border border-border-subtle">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">Compacted Persistence</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Append-only delta streams stored in replica-set MongoDB with periodic state vector snapshots and transactional compaction.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-6 bg-surface-canvas content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} CollabCode. Distributed collaborative engineering workbench.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-accent text-[11px]">Phase 2: Multi-File Workspaces & Roles</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
