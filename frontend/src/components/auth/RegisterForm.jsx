import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, ArrowRight, Loader2, Code2 } from 'lucide-react';
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
      setAuth(data.user, data.accessToken, data.refreshToken);
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
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-surface-raised border border-border-default shadow-2xl transition-colors duration-200">
      <div className="text-center mb-6">
        <div className="w-10 h-10 rounded-2xl bg-[#0071e3] flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-[#0071e3]/20">
          <Code2 className="w-5 h-5 stroke-[2.2]" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Create an Account</h1>
        <p className="text-xs text-text-secondary mt-1.5">
          Get started with your collaborative cloud studio
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-red-400 text-xs"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Social Google Login */}
      <OAuthButton text="Sign up with Google" />

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-default" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
          <span className="bg-surface-raised px-2.5 text-text-muted font-medium">or register with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Display Name */}
        <div>
          <label
            htmlFor="register-displayName"
            className="block text-[11px] font-medium text-text-secondary mb-1"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
              <User className="w-4 h-4" />
            </div>
            <input
              id="register-displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Developer Name"
              className={`w-full pl-10 pr-4 py-2.5 bg-surface-subtle border rounded-xl text-text-primary placeholder-text-muted text-xs focus:outline-none transition-all ${
                errors.displayName
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-border-default focus:border-[#0071e3]'
              }`}
            />
          </div>
          {errors.displayName && (
            <p className="mt-1 text-[11px] text-red-500">{errors.displayName}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="register-email"
            className="block text-[11px] font-medium text-text-secondary mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="developer@domain.com"
              className={`w-full pl-10 pr-4 py-2.5 bg-surface-subtle border rounded-xl text-text-primary placeholder-text-muted text-xs focus:outline-none transition-all ${
                errors.email
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-border-default focus:border-[#0071e3]'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="register-password"
            className="block text-[11px] font-medium text-text-secondary mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
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
              className={`w-full pl-10 pr-4 py-2.5 bg-surface-subtle border rounded-xl text-text-primary placeholder-text-muted text-xs focus:outline-none transition-all ${
                errors.password
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-border-default focus:border-[#0071e3]'
              }`}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-[11px] text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="register-confirmPassword"
            className="block text-[11px] font-medium text-text-secondary mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
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
              className={`w-full pl-10 pr-4 py-2.5 bg-surface-subtle border rounded-xl text-text-primary placeholder-text-muted text-xs focus:outline-none transition-all ${
                errors.confirmPassword
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-border-default focus:border-[#0071e3]'
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-[11px] text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          id="register-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-2.5 px-4 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-[#0071e3]/20 active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-text-secondary mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[#0071e3] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
