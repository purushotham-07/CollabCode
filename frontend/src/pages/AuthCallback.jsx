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
    <div className="min-h-screen bg-surface-canvas text-text-primary flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-md w-full p-8 rounded-3xl bg-surface-raised text-center border border-border-default shadow-2xl">
        {error ? (
          <div>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Authentication Failed</h2>
            <p className="text-xs text-text-secondary mb-6">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-full bg-surface-canvas hover:bg-surface-active border border-border-default text-text-primary text-xs font-medium transition-all"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-[#0071e3] animate-spin mb-4" />
            <h2 className="text-base font-semibold text-text-primary">Completing Google sign in...</h2>
            <p className="text-xs text-text-secondary mt-1">
              Validating session and setting up your workspace credentials
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
