import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { registerSchema } from '../../lib/zod-schemas';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import OAuthButton from './OAuthButton';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

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

    const result = registerSchema.safeParse(formData);
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
      const data = await authApi.register({
        displayName: formData.displayName,
        email: formData.email,
        password: formData.password,
      });
      setAuth(data.user, data.accessToken);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to register account. Please check your details.';
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl glass-panel shadow-2xl border border-slate-800">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-white">Create your account</h2>
        <p className="text-sm text-slate-400 mt-2">
          Start editing collaboratively in real-time with sub-millisecond CRDT sync
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm animate-in fade-in duration-200"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Google OAuth Option */}
      <OAuthButton />

      <div className="relative my-6 flex items-center justify-center">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-slate-900 px-3 text-xs uppercase font-mono tracking-wider text-slate-500 absolute">
          or sign up with email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Display Name */}
        <div>
          <label
            htmlFor="register-displayName"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Display Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              id="register-displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Alice Smith"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.displayName
                  ? 'border-red-500/50 focus:ring-red-500/40'
                  : 'border-slate-800 focus:border-brand-500/80 focus:ring-brand-500/20'
              }`}
            />
          </div>
          {errors.displayName && (
            <p className="mt-1 text-xs text-red-400">{errors.displayName}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="register-email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alice@example.com"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-red-500/50 focus:ring-red-500/40'
                  : 'border-slate-800 focus:border-brand-500/80 focus:ring-brand-500/20'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="register-password"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? 'border-red-500/50 focus:ring-red-500/40'
                  : 'border-slate-800 focus:border-brand-500/80 focus:ring-brand-500/20'
              }`}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="register-confirmPassword"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword
                  ? 'border-red-500/50 focus:ring-red-500/40'
                  : 'border-slate-800 focus:border-brand-500/80 focus:ring-brand-500/20'
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          id="register-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-600 hover:to-emerald-700 text-slate-950 font-semibold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
