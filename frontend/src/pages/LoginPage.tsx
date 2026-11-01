import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, Shield, X, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Google Account Chooser Modal
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const { refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const cleanEmail = email.trim();
      await authService.login(cleanEmail, password);
      await refreshProfile();
      if (cleanEmail.toLowerCase() === 'levixfashions@gmail.com') {
        navigate(from && from !== '/account' ? from : '/admin/products', { replace: true });
      } else {
        navigate(from || '/account', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSelect = async (selectedEmail: string) => {
    setErrorMsg(null);
    setLoading(true);
    setShowGoogleModal(false);
    try {
      const cleanEmail = selectedEmail.trim();
      await authService.loginWithGoogle(cleanEmail);
      await refreshProfile();
      if (cleanEmail.toLowerCase() === 'levixfashions@gmail.com') {
        navigate(from && from !== '/account' ? from : '/admin/products', { replace: true });
      } else {
        navigate(from || '/account', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      
      <div className="text-center space-y-2">
        <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black">
          Client Login
        </h1>
        <p className="text-xs text-neutral-600">
          Access your order history, saved delivery addresses, and private drops.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-100 border border-red-300 text-red-800 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Google Sign-In Button */}
      <button
        onClick={() => setShowGoogleModal(true)}
        disabled={loading}
        className="w-full bg-white border border-black/20 hover:border-black py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-black flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Google Account Selector Dialog */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 space-y-5 border border-black/10">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="text-sm font-semibold text-neutral-800">Sign in with Google</span>
              </div>
              <button 
                onClick={() => setShowGoogleModal(false)}
                className="text-neutral-400 hover:text-black p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-neutral-500">Choose an account to continue to <span className="font-semibold text-black">LEVIX</span></p>
            </div>

            {/* Account List */}
            <div className="space-y-2 border-y border-neutral-100 py-3">
              
              {/* Store Owner Option */}
              <button
                type="button"
                onClick={() => handleGoogleSelect('levixfashions@gmail.com')}
                className="w-full text-left p-3 rounded hover:bg-neutral-50 border border-neutral-200 hover:border-black/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-[#FF5400] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    L
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-bold text-neutral-900 group-hover:text-black">Levix Store Admin</p>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-black text-white uppercase rounded-xs">Owner</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-mono">levixfashions@gmail.com</p>
                  </div>
                </div>
                <Shield className="w-4 h-4 text-[#FF5400] opacity-80 group-hover:opacity-100" />
              </button>

              {/* Use Another Account Toggle */}
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full text-left p-3 rounded hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all flex items-center space-x-3 text-neutral-700"
                >
                  <div className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">Use another account</span>
                </button>
              ) : (
                <div className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                    Enter Google Email
                  </label>
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full bg-white border border-neutral-300 p-2 text-xs focus:border-black focus:outline-none rounded"
                  />
                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="text-[11px] text-neutral-500 hover:text-black px-2 py-1"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={!customGoogleEmail.trim()}
                      onClick={() => handleGoogleSelect(customGoogleEmail)}
                      className="px-3 py-1 bg-black text-white text-[11px] font-bold rounded uppercase tracking-wider disabled:opacity-50"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

            </div>

            <p className="text-[10px] text-neutral-400 text-center">
              Secured with Google OAuth protocol for LEVIX Luxury Streetwear.
            </p>

          </div>
        </div>
      )}

      <div className="relative flex items-center justify-center">
        <div className="border-t border-black/10 w-full" />
        <span className="bg-[#EFEFEF] px-3 text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
          Or with Email
        </span>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-white border border-black/20 p-3 text-xs focus:border-black focus:outline-none"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] text-neutral-500 hover:text-black uppercase tracking-wider underline"
            >
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white border border-black/20 p-3 text-xs focus:border-black focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Registration link */}
      <div className="pt-4 text-center text-xs text-neutral-600 border-t border-black/10">
        Don't have a Levix profile?{' '}
        <Link to="/register" className="font-bold text-black uppercase underline ml-1">
          Create Account
        </Link>
      </div>

    </div>
  );
};
