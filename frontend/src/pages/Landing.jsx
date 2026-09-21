import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Users, Zap, Shield, GitBranch, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col selection:bg-brand-500/30 selection:text-brand-100">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-28">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Production-Grade Distributed CRDT Engine</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
              Code together in real time.{' '}
              <span className="bg-gradient-to-r from-brand-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Zero merge conflicts.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Engineered for distributed teams. Multi-file editing powered by Yjs CRDT,
              multi-node fanout over Redis Pub/Sub, and append-only MongoDB compaction.
            </p>

            {/* Mandatory Call to Action */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                id="hero-cta-btn"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-600 hover:to-emerald-700 text-slate-950 font-bold text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Start coding together, free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 hover:border-slate-700"
              >
                <Play className="w-4 h-4 text-brand-400 fill-brand-400" />
                <span>Explore Live Demo</span>
              </Link>
            </div>

            {/* Features preview strip */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>No sticky sessions required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Yjs delta updates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>RS256 JWT + Refresh Rotation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>3-Node Redis Fanout</span>
              </div>
            </div>

            {/* Interactive Workspace Preview Simulation */}
            <div className="mt-16 max-w-5xl mx-auto rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-2xl text-left">
              {/* Fake Window Title Bar */}
              <div className="h-10 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs font-mono text-slate-400">
                    collabcode-workspace / src / crdt-sync.ts
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-emerald-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                      AL
                    </span>
                    <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-sky-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                      BO
                    </span>
                    <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-amber-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                      CA
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    3 Connected
                  </span>
                </div>
              </div>

              {/* Code Editor Mock Screen */}
              <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto text-slate-300 grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Line Numbers + Code */}
                <div className="md:col-span-8 space-y-1">
                  <p><span className="text-slate-600 mr-4 select-none">01</span><span className="text-purple-400">import</span> * <span className="text-purple-400">as</span> Y <span className="text-purple-400">from</span> <span className="text-emerald-300">'yjs'</span>;</p>
                  <p><span className="text-slate-600 mr-4 select-none">02</span><span className="text-purple-400">import</span> &#123; WebsocketProvider &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'y-websocket'</span>;</p>
                  <p><span className="text-slate-600 mr-4 select-none">03</span></p>
                  <p><span className="text-slate-600 mr-4 select-none">04</span><span className="text-slate-500">// Collaborative document state initialized</span></p>
                  <p><span className="text-slate-600 mr-4 select-none">05</span><span className="text-blue-400">const</span> doc = <span className="text-blue-400">new</span> Y.Doc();</p>
                  <p className="bg-emerald-500/10 -mx-6 px-6 py-0.5 border-l-2 border-emerald-400">
                    <span className="text-slate-600 mr-4 select-none">06</span>
                    <span className="text-blue-400">const</span> yText = doc.getText(<span className="text-emerald-300">'monaco'</span>);
                    <span className="inline-block ml-2 px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded animate-pulse">Alice</span>
                  </p>
                  <p><span className="text-slate-600 mr-4 select-none">07</span>yText.observe(event =&gt; &#123;</p>
                  <p><span className="text-slate-600 mr-4 select-none">08</span>  console.log(<span className="text-emerald-300">'CRDT delta applied with zero conflicts'</span>, event.delta);</p>
                  <p><span className="text-slate-600 mr-4 select-none">09</span>&#125;);</p>
                </div>

                {/* Mini Chat / Presence Sidebar Preview */}
                <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-4 flex flex-col justify-between text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-3">
                      Live Workspace Chat
                    </span>
                    <div className="space-y-3">
                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-emerald-400 font-semibold">Alice</span>
                          <span className="text-slate-500">10:42 AM</span>
                        </div>
                        <p className="text-slate-300 font-sans text-xs">
                          Just refactored the CRDT delta stream. Test convergence across node A and B!
                        </p>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-sky-400 font-semibold">Bob</span>
                          <span className="text-slate-500">10:43 AM</span>
                        </div>
                        <p className="text-slate-300 font-sans text-xs">
                          Confirmed! Changes replicated instantly across Redis channel.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-slate-400 font-sans">STOMP channel active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20 border-t border-slate-900 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Architected for resilience and scale
              </h2>
              <p className="text-slate-400 mt-3 text-base">
                Every component is built without shortcuts — ready for production concurrency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-5 border border-brand-500/20">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Yjs CRDT Binary Sync</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Real-time document convergence via binary state vectors and deltas over raw WebSockets without sticky session dependencies.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-5 border border-sky-500/20">
                  <GitBranch className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Distributed Redis Fanout</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  3 backend replicas orchestrated behind Nginx. Broadcasts propagate across Redis channels with sub-millisecond inter-node latency.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 border border-purple-500/20">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Compacted Persistence</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Append-only delta stream in MongoDB plus periodic state snapshots with transactional compaction and automatic rollback.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-[#090D14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CollabCode. Open-source distributed collaborative editor.</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-emerald-400">Phase 1: Auth & Scaffold Complete</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
