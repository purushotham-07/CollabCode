import React from 'react';
import Navbar from '../components/Navbar';
import RegisterForm from '../components/auth/RegisterForm';

export default function Register() {
  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <RegisterForm />
      </main>
    </div>
  );
}
