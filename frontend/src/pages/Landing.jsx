import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  GitBranch,
  ArrowRight,
  Play,
  Check,
  Code2,
  Cpu,
  ShieldCheck,
  MessageSquare,
  History,
  FileCode,
  FolderTree,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { Badge, Kbd, Avatar, AvatarStack } from '../components/ui/Badge';

export default function Landing() {
  const [activeTab, setActiveTab] = useState('index.ts');

  return (
    <div className="min-h-screen bg-surface-canvas text-text-primary flex flex-col selection:bg-accent-subtle selection:text-accent-base">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION - Height-Calibrated for 1440x900 Above-the-Fold Visibility */}
        {/* ========================================================================= */}
        <section className="relative pt-8 pb-10 border-b border-border-subtle overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Value Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-border-default bg-surface-raised text-text-secondary text-xs font-mono mb-4">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>COLLEAGUE-FIRST PAIR PROGRAMMING</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-text-primary max-w-3xl mx-auto leading-[1.12]">
              Code together, <br className="hidden sm:inline" />
              <span className="text-accent">in real time.</span>
            </h1>

            {/* Benefit-led Subhead */}
            <p className="mt-3 text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
              Open a collaborative workspace, share a link, and build software with your team with sub-millisecond sync and zero merge conflicts.
            </p>

            {/* Primary Call to Action */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" id="hero-primary-cta">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Start coding free
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<Play className="w-3.5 h-3.5 text-accent fill-accent" />}
                >
                  Try live demo
                </Button>
              </Link>
            </div>

            {/* Trust Line */}
            <p className="mt-2.5 text-[11px] text-text-muted font-sans">
              Free forever for teams · No credit card required · Runs in your browser
            </p>

            {/* ===================================================================== */}
            {/* HERO PRODUCT VISUAL - Live-Rendered, Non-Cutoff Editor Mockup        */}
            {/* ===================================================================== */}
            <div className="mt-7 max-w-4xl mx-auto rounded-lg border border-border-default bg-surface-subtle shadow-soft-lg overflow-hidden text-left">
              {/* Top Window Bar */}
              <div className="h-8 bg-surface-raised border-b border-border-subtle px-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-border-default" />
                    <div className="w-2.5 h-2.5 rounded-full bg-border-default" />
                    <div className="w-2.5 h-2.5 rounded-full bg-border-default" />
                  </div>
                  <span className="text-[11px] font-mono text-text-muted ml-2">
                    algolabs-workspace / src / crdt-sync.ts
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <AvatarStack
                    users={[
                      { displayName: 'Alice Chen' },
                      { displayName: 'Bob Taylor' },
                      { displayName: 'Carol Danvers' },
                    ]}
                    size="sm"
                  />
                  <Badge variant="accent" size="sm">
                    3 Active
                  </Badge>
                </div>
              </div>

              {/* Editor Split Canvas (File tree + Tabs + Code + Mini Chat) */}
              <div className="grid grid-cols-12 h-64 sm:h-72 overflow-hidden text-xs">
                {/* Left Mini Explorer */}
                <div className="hidden md:flex md:col-span-3 border-r border-border-subtle bg-surface-subtle p-2 flex-col font-mono text-[11px]">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-border-subtle text-text-muted uppercase text-[10px]">
                    <span>Explorer</span>
                    <span>Files</span>
                  </div>
                  <div className="space-y-0.5 text-text-secondary">
                    <div className="flex items-center gap-1.5 py-0.5 px-1.5 rounded-sm text-text-muted">
                      <span>▾ src</span>
                    </div>
                    <div className="flex items-center gap-1.5 py-0.5 pl-4 pr-1.5 rounded-sm bg-surface-raised text-accent font-medium">
                      <FileCode className="w-3 h-3" />
                      <span>crdt-sync.ts</span>
                    </div>
                    <div className="flex items-center gap-1.5 py-0.5 pl-4 pr-1.5 rounded-sm hover:text-text-primary">
                      <FileCode className="w-3 h-3" />
                      <span>presence.ts</span>
                    </div>
                    <div className="flex items-center gap-1.5 py-0.5 pl-4 pr-1.5 rounded-sm hover:text-text-primary">
                      <FileCode className="w-3 h-3" />
                      <span>socket.ts</span>
                    </div>
                  </div>
                </div>

                {/* Center Code Area */}
                <div className="col-span-12 md:col-span-6 bg-surface-canvas flex flex-col overflow-hidden">
                  {/* File Tab */}
                  <div className="h-7 bg-surface-subtle border-b border-border-subtle flex items-center px-2 gap-1">
                    <div className="px-2.5 py-0.5 rounded-t-sm bg-surface-canvas border-t-2 border-accent text-[11px] font-mono font-medium text-text-primary flex items-center gap-1.5">
                      <FileCode className="w-3 h-3 text-accent" />
                      <span>crdt-sync.ts</span>
                    </div>
                  </div>

                  {/* Code Lines with Non-Overlapping Remote Cursors */}
                  <div className="p-3 font-mono text-xs leading-relaxed overflow-y-auto space-y-0.5 text-text-secondary">
                    <p><span className="text-text-muted mr-3 select-none">1</span><span className="text-accent">import</span> * <span className="text-accent">as</span> Y <span className="text-accent">from</span> <span className="text-text-primary">'yjs'</span>;</p>
                    <p><span className="text-text-muted mr-3 select-none">2</span><span className="text-accent">import</span> &#123; WebsocketProvider &#125; <span className="text-accent">from</span> <span className="text-text-primary">'y-websocket'</span>;</p>
                    <p><span className="text-text-muted mr-3 select-none">3</span></p>
                    <p className="relative">
                      <span className="text-text-muted mr-3 select-none">4</span>
                      <span className="text-text-primary font-semibold">export const</span> doc = <span className="text-text-primary font-semibold">new</span> Y.Doc();
                      {/* Alice Remote Cursor */}
                      <span className="inline-block relative ml-1">
                        <span className="inline-block w-0.5 h-3.5 bg-peer-1 align-middle" />
                        <span className="absolute -top-3.5 left-0 px-1 py-0.1 rounded-sm bg-peer-1 text-surface-canvas text-[9px] font-bold font-mono uppercase whitespace-nowrap shadow-soft-sm">
                          Alice
                        </span>
                      </span>
                    </p>
                    <p><span className="text-text-muted mr-3 select-none">5</span><span className="text-text-muted">// Synchronize document text</span></p>
                    <p><span className="text-text-muted mr-3 select-none">6</span><span className="text-text-primary font-semibold">const</span> sharedText = doc.getText(<span className="text-text-primary">'monaco'</span>);</p>
                    <p className="relative">
                      <span className="text-text-muted mr-3 select-none">7</span>
                      sharedText.insert(0, <span className="text-text-primary">'// Live CRDT'</span>);
                      {/* Bob Remote Cursor */}
                      <span className="inline-block relative ml-1">
                        <span className="inline-block w-0.5 h-3.5 bg-peer-2 align-middle" />
                        <span className="absolute -top-3.5 left-0 px-1 py-0.1 rounded-sm bg-peer-2 text-surface-canvas text-[9px] font-bold font-mono uppercase whitespace-nowrap shadow-soft-sm">
                          Bob
                        </span>
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right Mini Chat Panel */}
                <div className="hidden md:flex md:col-span-3 border-l border-border-subtle bg-surface-subtle p-2 flex-col justify-between text-[11px]">
                  <div>
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-border-subtle text-text-muted uppercase text-[10px] font-mono">
                      <span>Workspace Chat</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 rounded-sm bg-surface-raised border border-border-subtle">
                        <div className="flex items-center justify-between text-[10px] mb-0.5">
                          <span className="font-semibold text-peer-1">Alice</span>
                          <span className="text-text-muted font-mono">10:42</span>
                        </div>
                        <p className="text-text-secondary leading-snug">
                          Applied state vector updates. Test convergence on your replica!
                        </p>
                      </div>
                      <div className="p-2 rounded-sm bg-surface-raised border border-border-subtle">
                        <div className="flex items-center justify-between text-[10px] mb-0.5">
                          <span className="font-semibold text-peer-2">Bob</span>
                          <span className="text-text-muted font-mono">10:43</span>
                        </div>
                        <p className="text-text-secondary leading-snug">
                          Merged cleanly. Zero lag on cursor broadcast.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border-subtle flex items-center gap-1.5 text-text-muted font-mono text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span>Socket: Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FEATURE SECTION: 4 Alternating Layouts with Purpose-Built Visuals         */}
        {/* ========================================================================= */}
        <section id="features" className="py-20 border-b border-border-subtle">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
            {/* Feature 1: Real-Time CRDT Sync */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 text-left">
                <Badge variant="accent" size="sm" className="mb-3">
                  CONCURRENCY
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
                  Conflict-free synchronization.
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Multiple engineers can type on the exact same line at the exact same moment. Powered by Yjs Conflict-Free Replicated Data Types, updates merge deterministically without locks or git-style merge hell.
                </p>
                <div className="mt-5 space-y-2 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent" />
                    <span>Deterministic mathematical convergence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent" />
                    <span>Instant local echo with zero input stutter</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7">
                <div className="workbench-card p-4 text-left">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-subtle text-[11px] font-mono text-text-muted">
                    <span>Concurrent keystroke resolution</span>
                    <span className="text-accent">Convergence: 0ms lag</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-sm bg-surface-canvas border border-border-subtle">
                      <p className="text-[10px] text-peer-1 mb-1 uppercase font-semibold">User A Input</p>
                      <p className="text-text-primary">const sum = (a, b) =&gt;</p>
                      <p className="text-text-muted text-[10px] mt-2">+ timestamp: 10:44:01.102</p>
                    </div>
                    <div className="p-3 rounded-sm bg-surface-canvas border border-border-subtle">
                      <p className="text-[10px] text-peer-2 mb-1 uppercase font-semibold">User B Input</p>
                      <p className="text-text-primary">  return a + b;</p>
                      <p className="text-text-muted text-[10px] mt-2">+ timestamp: 10:44:01.104</p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 rounded-sm bg-surface-canvas border border-accent-border">
                    <p className="text-[10px] text-accent mb-1 uppercase font-semibold font-mono">Merged Result on All Replicas</p>
                    <pre className="text-xs text-text-primary font-mono">const sum = (a, b) =&gt; return a + b;</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Presence & Follow Mode */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 order-2 md:order-1">
                <div className="workbench-card p-4 text-left">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-subtle text-[11px] font-mono text-text-muted">
                    <span>Collaborator Cursor Coordinates</span>
                    <span className="text-accent">8 Distinct Colors</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: 'Alice', color: 'bg-peer-1 text-surface-canvas' },
                      { name: 'Bob', color: 'bg-peer-2 text-surface-canvas' },
                      { name: 'Carol', color: 'bg-peer-3 text-surface-canvas' },
                      { name: 'Dave', color: 'bg-peer-4 text-white' },
                      { name: 'Eve', color: 'bg-peer-5 text-white' },
                      { name: 'Frank', color: 'bg-peer-6 text-surface-canvas' },
                      { name: 'Grace', color: 'bg-peer-7 text-white' },
                      { name: 'Heidi', color: 'bg-peer-8 text-surface-canvas' },
                    ].map((c) => (
                      <div
                        key={c.name}
                        className="p-2 rounded-sm bg-surface-canvas border border-border-subtle flex items-center justify-between"
                      >
                        <span className="text-xs text-text-primary">{c.name}</span>
                        <span className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded-sm ${c.color}`}>
                          LIVE
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 order-1 md:order-2 text-left">
                <Badge variant="accent" size="sm" className="mb-3">
                  AWARENESS
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
                  Presence you can feel, without distraction.
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Instantly know where your teammates are looking, selecting, and typing. Follow any peer with a single click during pair programming sessions, code reviews, and remote debugging.
                </p>
              </div>
            </div>

            {/* Feature 3: Integrated Workspace Chat with Snippets */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 text-left">
                <Badge variant="accent" size="sm" className="mb-3">
                  COMMUNICATION
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
                  Workspace chat with code snippets.
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Stop copying links to external messenger apps. Discuss implementation choices directly inside the workspace with syntax-highlighted snippets that link to exact line numbers.
                </p>
              </div>
              <div className="md:col-span-7">
                <div className="workbench-card p-4 text-left space-y-3">
                  <div className="p-3 rounded-sm bg-surface-canvas border border-border-subtle">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-text-primary">Alice Chen</span>
                      <span className="text-[10px] font-mono text-text-muted">10:48 AM</span>
                    </div>
                    <p className="text-xs text-text-secondary mb-2">
                      Should we validate token expiration on the client or let the refresh interceptor handle 401s?
                    </p>
                    <div className="p-2 rounded-sm bg-surface-subtle border border-border-subtle font-mono text-[11px] text-accent">
                      <span>src/api/auth.js:L42-L48</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Compacted Persistence & Version History */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 order-2 md:order-1">
                <div className="workbench-card p-4 text-left font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-border-subtle text-[11px] text-text-muted">
                    <span>Document Delta Stream</span>
                    <span className="text-status-success">100% Retained</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="p-2 rounded-sm bg-surface-canvas border border-border-subtle text-text-secondary flex items-center justify-between">
                      <span>Snapshot #104 · Compacted Vector</span>
                      <span className="text-[10px] text-text-muted">2 mins ago</span>
                    </div>
                    <div className="p-2 rounded-sm bg-surface-canvas border border-border-subtle text-text-secondary flex items-center justify-between">
                      <span>Delta Stream #105 · 4 bytes</span>
                      <span className="text-[10px] text-text-muted">Just now</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 order-1 md:order-2 text-left">
                <Badge variant="accent" size="sm" className="mb-3">
                  DURABILITY
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
                  Compacted history and instant rollback.
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Every edit appends to a distributed delta journal. Automatic compaction collapses intermediate states into fast document snapshots, keeping workspace memory minimal and restore times instantaneous.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* "HOW IT WORKS" - 3 Clear Steps                                            */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="py-20 border-b border-border-subtle bg-surface-subtle/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="accent" size="sm" className="mb-3">
              WORKFLOW
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
              Up and running in 10 seconds.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary max-w-lg mx-auto">
              No local installation, no docker dependencies, no terminal tunnels.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="workbench-card p-6">
                <span className="text-xl font-bold font-mono text-accent">01</span>
                <h3 className="text-base font-semibold text-text-primary mt-2 mb-1">
                  Create a Workspace
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Initialize a multi-file document tree in your browser with starter templates or custom files.
                </p>
              </div>

              <div className="workbench-card p-6">
                <span className="text-xl font-bold font-mono text-accent">02</span>
                <h3 className="text-base font-semibold text-text-primary mt-2 mb-1">
                  Share Expiring Link
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Generate secure invite tokens with granular Editor or Viewer roles and customizable expiration.
                </p>
              </div>

              <div className="workbench-card p-6">
                <span className="text-xl font-bold font-mono text-accent">03</span>
                <h3 className="text-base font-semibold text-text-primary mt-2 mb-1">
                  Code Collaboratively
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Edit code together with real-time cursor presence, synchronized scroll, and in-context workspace chat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* "UNDER THE HOOD" - Architecture & Real Load Test Benchmarks                */}
        {/* ========================================================================= */}
        <section id="architecture" className="py-20 border-b border-border-subtle">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="accent" size="sm" className="mb-3">
              ENGINEERING SPECIFICATION
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
              Distributed system architecture.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
              Designed for horizontal scalability across stateless Spring Boot nodes, Redis Pub/Sub broadcast channels, and MongoDB replica sets.
            </p>

            {/* Benchmark Grid */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="workbench-card p-4">
                <p className="text-[11px] font-mono uppercase text-text-muted">Local Echo Latency</p>
                <p className="text-2xl font-bold font-mono text-accent mt-1">&lt; 15ms</p>
                <p className="text-[10px] text-text-muted mt-1">Instant compositor update</p>
              </div>

              <div className="workbench-card p-4">
                <p className="text-[11px] font-mono uppercase text-text-muted">Convergence Rate</p>
                <p className="text-2xl font-bold font-mono text-accent mt-1">100%</p>
                <p className="text-[10px] text-text-muted mt-1">Deterministic CRDT</p>
              </div>

              <div className="workbench-card p-4">
                <p className="text-[11px] font-mono uppercase text-text-muted">Sticky Sessions</p>
                <p className="text-2xl font-bold font-mono text-accent mt-1">0</p>
                <p className="text-[10px] text-text-muted mt-1">Horizontal fan-out</p>
              </div>

              <div className="workbench-card p-4">
                <p className="text-[11px] font-mono uppercase text-text-muted">Cryptographic Auth</p>
                <p className="text-2xl font-bold font-mono text-accent mt-1">RS256</p>
                <p className="text-[10px] text-text-muted mt-1">Rotating JWT tokens</p>
              </div>
            </div>

            {/* Architecture Details Box */}
            <div className="mt-6 workbench-card p-5 text-left text-xs font-mono text-text-secondary space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <span className="text-text-primary font-semibold">Architecture Topology</span>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-accent hover:underline text-[11px]"
                >
                  <span>View Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-text-muted leading-relaxed">
                1. <span className="text-text-primary font-medium">Browser Clients:</span> React 18 + Yjs CRDT + WebSocket binary provider transmitting framed sync-step-1 and update vectors.
              </p>
              <p className="text-text-muted leading-relaxed">
                2. <span className="text-text-primary font-medium">Load Balancer:</span> Nginx round-robin proxy distributing WebSocket connections across 3 backend replicas.
              </p>
              <p className="text-text-muted leading-relaxed">
                3. <span className="text-text-primary font-medium">Distribution Layer:</span> Redis Pub/Sub broadcasting delta vectors across all cluster instances with sub-millisecond inter-node latency.
              </p>
              <p className="text-text-muted leading-relaxed">
                4. <span className="text-text-primary font-medium">Compacted Storage:</span> MongoDB replica set storing append-only delta logs with transactional compaction snapshots.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FINAL CALL TO ACTION BAND                                                 */}
        {/* ========================================================================= */}
        <section className="py-16 bg-surface-subtle/50 text-center border-b border-border-subtle">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
              Ready to code together?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
              Open your first real-time collaborative workspace in under ten seconds.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Start coding free
                </Button>
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg">
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="py-10 bg-surface-canvas border-t border-border-subtle text-xs text-text-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-left mb-8">
          <div>
            <span className="font-semibold text-text-primary block mb-3 font-mono uppercase text-[11px]">
              Product
            </span>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-text-primary">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-text-primary">How It Works</a></li>
              <li><Link to="/dashboard" className="hover:text-text-primary">Workspaces</Link></li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-text-primary block mb-3 font-mono uppercase text-[11px]">
              Architecture
            </span>
            <ul className="space-y-2">
              <li><a href="#architecture" className="hover:text-text-primary">System Design</a></li>
              <li><a href="#architecture" className="hover:text-text-primary">CRDT Benchmarks</a></li>
              <li><a href="https://github.com" className="hover:text-text-primary">GitHub Repository</a></li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-text-primary block mb-3 font-mono uppercase text-[11px]">
              Legal & Privacy
            </span>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-text-primary">Terms of Service</Link></li>
              <li><a href="#cookies" className="hover:text-text-primary">Cookie Preferences</a></li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-text-primary block mb-3 font-mono uppercase text-[11px]">
              CollabCode
            </span>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Open-source, distributed real-time collaborative code editor powered by Yjs and Spring Boot.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} CollabCode. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-accent text-[11px]">Status: All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
