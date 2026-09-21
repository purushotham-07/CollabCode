import React, { useState, useEffect } from 'react';
import { authApi } from '../../api/auth';

export default function OAuthButton() {
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    const fetchOAuthUrl = async () => {
      try {
        const data = await authApi.getGoogleAuthUrl();
        setConfigured(data.configured);
        setAuthUrl(data.url);
      } catch (err) {
        setConfigured(false);
      }
    };
    fetchOAuthUrl();
  }, []);

  const handleGoogleLogin = () => {
    if (!configured || !authUrl) {
      alert('Google OAuth is not configured in this environment yet. You can sign up and log in using email & password!');
      return;
    }
    setLoading(true);
    window.location.href = authUrl;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800/80 text-slate-200 hover:text-white font-medium text-sm transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed group"
    >
      <svg className="w-5 h-5 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
        <path
          fill="#EA4335"
          d="M12 5c1.54 0 2.9.54 3.98 1.43l2.97-2.97C17.15 1.77 14.77 1 12 1 7.42 1 3.54 3.6 1.63 7.37l3.66 2.84C6.18 7.3 8.87 5 12 5z"
        />
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.41-4.93 3.41-8.7z"
        />
        <path
          fill="#FBBC05"
          d="M5.29 14.79c-.23-.68-.36-1.41-.36-2.16s.13-1.48.36-2.16L1.63 7.63C.59 9.71 0 12 0 14.37c0 2.37.59 4.66 1.63 6.74l3.66-2.84z"
        />
        <path
          fill="#34A853"
          d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.08.72-2.45 1.16-4.22 1.16-3.13 0-5.82-2.3-6.71-5.21L1.63 16.5C3.54 20.27 7.42 23 12 23z"
        />
      </svg>
      <span>{loading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
      {!configured && (
        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
          Optional
        </span>
      )}
    </button>
  );
}
