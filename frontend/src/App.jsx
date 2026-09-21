import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Protected Application Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center p-4 text-center">
              <h1 className="text-7xl font-extrabold text-brand-400 font-mono">404</h1>
              <p className="text-xl font-bold text-white mt-4">Page not found</p>
              <p className="text-sm text-slate-400 mt-2 max-w-sm">
                The page or workspace you are trying to reach does not exist or has moved.
              </p>
              <a
                href="/"
                className="mt-6 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
              >
                Return to Home
              </a>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
