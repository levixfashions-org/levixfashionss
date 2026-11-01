import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await authService.resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      
      <div className="text-center space-y-2">
        <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black">
          Reset Password
        </h1>
        <p className="text-xs text-neutral-600">
          Enter your registered email to receive secure password recovery instructions.
        </p>
      </div>

      {success ? (
        <div className="bg-white p-6 border border-black/10 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-black mx-auto stroke-1" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-black uppercase">Email Dispatched</h3>
            <p className="text-xs text-neutral-600">
              Please check your inbox at <span className="font-bold text-black">{email}</span> for your reset link.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-black underline"
          >
            Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Registered Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-white border border-black/20 p-3 text-xs focus:border-black focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Sending Link...' : 'Send Recovery Link'}
          </button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-neutral-600 hover:text-black uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}

    </div>
  );
};
