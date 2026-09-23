import React from 'react';
import Navbar from '../components/Navbar';
import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-surface-canvas text-text-primary flex flex-col selection:bg-[#0071e3]/30 selection:text-white relative overflow-hidden transition-colors duration-200">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#0071e3]/10 blur-[130px] pointer-events-none rounded-full" />

      <Navbar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center relative z-10">
        <LoginForm />

        <div className="mt-8 text-center text-[11px] text-text-muted">
          Copyright © CollabCode Studio. All rights reserved.
        </div>
      </main>
    </div>
  );
}
