import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { inviteApi } from '../api/invite';
import { useAuth } from '../hooks/useAuth';
import RoleBadge from '../components/RoleBadge';
import { UserPlus, ArrowRight, AlertCircle, Loader2, Code2 } from 'lucide-react';

export default function JoinWorkspace() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();

  const [invite, setInvite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInviteDetails = async () => {
      try {
        const data = await inviteApi.getInvite(token);
        setInvite(data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'This invitation link is invalid or has expired.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchInviteDetails();
    }
  }, [token]);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      const workspace = await inviteApi.acceptInvite(token);
      navigate(`/workspace/${workspace.id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to accept invite.');
      setIsJoining(false);
    }
  };

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 selection:bg-brand-500/30">
      <div className="max-w-md w-full p-8 rounded-2xl glass-panel border border-slate-800 shadow-2xl text-center">
        {error ? (
          <div>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Invalid Invitation</h2>
            <p className="text-sm text-slate-400 mb-6">{error}</p>
            <Link
              to="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto mb-4 border border-brand-500/20">
              <Code2 className="w-6 h-6" />
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">You've been invited!</h2>
            <p className="text-sm text-slate-400 mt-2">
              Join collaborative workspace <span className="font-semibold text-slate-200">"{invite?.workspaceName}"</span>
            </p>

            <div className="my-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Assigned Role:</span>
              <RoleBadge role={invite?.role} size="md" />
            </div>

            {isAuthenticated ? (
              <div>
                <p className="text-xs text-slate-400 mb-4 font-mono">
                  Signed in as <span className="text-slate-200">{user?.displayName}</span> ({user?.email})
                </p>
                <button
                  onClick={handleJoin}
                  disabled={isJoining}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-600 hover:to-emerald-700 text-slate-950 font-bold text-sm shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Joining Workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Accept Invitation & Join</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 mb-2">
                  Please log in or create an account to accept this invite
                </p>
                <Link
                  to="/login"
                  state={{ from: { pathname: `/invite/${token}` } }}
                  className="block w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-sm transition-colors"
                >
                  Sign In to Join
                </Link>
                <Link
                  to="/register"
                  state={{ from: { pathname: `/invite/${token}` } }}
                  className="block w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-sm border border-slate-800 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
