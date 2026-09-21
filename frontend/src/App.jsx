import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import WorkspaceView from './pages/WorkspaceView';
import JoinWorkspace from './pages/JoinWorkspace';
import LegalPrivacy from './pages/LegalPrivacy';
import TermsOfService from './pages/TermsOfService';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/ui/Toast';
import ConsentNotice from './components/ui/ConsentNotice';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/invite/:token" element={<JoinWorkspace />} />
          <Route path="/privacy" element={<LegalPrivacy />} />
          <Route path="/terms" element={<TermsOfService />} />
          
          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspace/:id"
            element={
              <ProtectedRoute>
                <WorkspaceView />
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-surface-canvas text-text-primary flex flex-col items-center justify-center p-4 text-center selection:bg-accent-subtle selection:text-accent-base">
                <div className="w-12 h-12 rounded-md bg-surface-raised border border-border-default flex items-center justify-center mb-4 text-text-muted">
                  <FileQuestion className="w-6 h-6 text-accent" />
                </div>
                <h1 className="text-4xl font-bold text-text-primary font-mono tracking-tight">404</h1>
                <p className="text-base font-semibold text-text-primary mt-2">Page not found</p>
                <p className="text-xs text-text-muted mt-1 max-w-sm leading-relaxed">
                  The document or workspace you are trying to reach does not exist or has moved.
                </p>
                <Link
                  to="/"
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-accent text-text-on-accent text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Home</span>
                </Link>
              </div>
            }
          />
        </Routes>
        <ConsentNotice />
      </Router>
    </ToastProvider>
  );
}
