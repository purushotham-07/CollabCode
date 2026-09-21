import React from 'react';
import Navbar from '../components/Navbar';
import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col selection:bg-accent-subtle selection:text-accent-base">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <LoginForm />
      </main>
    </div>
  );
}
