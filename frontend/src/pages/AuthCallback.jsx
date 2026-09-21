import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('Missing authorization code from Google OAuth callback.');
      return;
    }

    const exchangeCode = async () => {
      try {
        const data = await authApi.googleCallback(code);
        setAuth(data.user, data.accessToken);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Failed to complete Google authentication.'
        );
      }
    };

    exchangeCode();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl glass-panel text-center border border-slate-800">
        {error ? (
          <div>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Authentication Failed</h2>
            <p className="text-sm text-slate-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-brand-400 animate-spin mb-4" />
            <h2 className="text-lg font-semibold text-white">Completing Google sign in...</h2>
            <p className="text-xs text-slate-400 mt-1">
              Validating session and setting up your workspace credentials
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
