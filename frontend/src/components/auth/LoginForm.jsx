import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { loginSchema } from '../../lib/zod-schemas';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import OAuthButton from './OAuthButton';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const data = await authApi.login(formData);
      setAuth(data.user, data.accessToken);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Invalid email or password. Please try again.';
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-7 rounded-lg bg-surface-raised border border-border-default shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">Sign in to CollabCode</h2>
        <p className="text-xs text-text-muted mt-1.5">
          Access your collaborative workspaces and synchronized documents
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-5 p-3 rounded-md bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-300 text-xs"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Google OAuth Option */}
      <OAuthButton />

      <div className="relative my-5 flex items-center justify-center">
        <div className="border-t border-border-subtle w-full" />
        <span className="bg-surface-raised px-2.5 text-[10px] uppercase font-mono tracking-wider text-text-muted absolute">
          or continue with email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-[11px] font-mono font-medium uppercase tracking-wider text-text-secondary mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="developer@domain.com"
              className={`w-full pl-9 pr-3.5 py-2 bg-surface-canvas border rounded-md text-text-primary placeholder-text-muted text-xs focus:outline-none transition-colors duration-120 ${
                errors.email
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-border-default focus:border-accent'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[11px] text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="login-password"
            className="block text-[11px] font-mono font-medium uppercase tracking-wider text-text-secondary mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-9 pr-3.5 py-2 bg-surface-canvas border rounded-md text-text-primary placeholder-text-muted text-xs focus:outline-none transition-colors duration-120 ${
                errors.password
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-border-default focus:border-accent'
              }`}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-[11px] text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          id="login-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2 px-4 rounded-md bg-accent text-text-on-accent font-medium text-xs hover:opacity-90 active:scale-[0.99] transition-[opacity,transform] duration-120 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-text-muted mt-5">
        Don't have an account?{' '}
        <Link to="/register" className="text-accent hover:underline font-medium">
          Create account
        </Link>
      </p>
    </div>
  );
}
