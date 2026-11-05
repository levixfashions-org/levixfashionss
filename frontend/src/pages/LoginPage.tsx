import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, X, User as UserIcon, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
      // If store owner, take directly to admin
      if (cleanEmail.toLowerCase() === 'levixfashions@gmail.com') {
        navigate(from && from !== '/account' ? from : '/admin/products', { replace: true });
      } else {
        // Normal customer goes to their account
        navigate(from || '/account', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const executeGoogleLogin = async (targetEmail: string) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const cleanEmail = targetEmail.trim();
      const user = await authService.loginWithGoogle(cleanEmail);
      await refreshProfile();
      setShowGoogleModal(false);

      const loggedEmail = (user?.email || (user as any)?.user?.email || cleanEmail).trim().toLowerCase();
      if (loggedEmail === 'levixfashions@gmail.com') {
        navigate(from && from !== '/account' ? from : '/admin/products', { replace: true });
      } else {
        navigate(from || '/account', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customGoogleEmail.trim()) {
      executeGoogleLogin(customGoogleEmail.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      
      <div className="text-center space-y-2">
        <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black">
          Login
        </h1>
        <p className="text-xs text-neutral-600">
          Sign in to your account
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
          className="w-full bg-black text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 cursor-pointer"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Registration link */}
      <div className="pt-4 text-center text-xs text-neutral-600 border-t border-black/10">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-black uppercase underline ml-1">
          Create Account
        </Link>
      </div>

      {/* Google OAuth Account Selection Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl border border-neutral-200 overflow-hidden text-neutral-800">
            
            {/* Google Modal Header */}
            <div className="p-5 pb-3 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="font-semibold text-sm text-neutral-800">Sign in with Google</span>
              </div>
              <button
                onClick={() => { setShowGoogleModal(false); setShowCustomInput(false); }}
                className="p-1 text-neutral-400 hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-neutral-600 text-xs">
                Choose an account to continue to <span className="font-bold text-black font-display tracking-wider">LEVIX</span>
              </p>

              {/* Account 1: Store Owner */}
              <button
                onClick={() => executeGoogleLogin('levixfashions@gmail.com')}
                disabled={loading}
                className="w-full p-3 rounded-lg border border-neutral-200 hover:border-black hover:bg-neutral-50 flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-[#FF5400] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    L
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-neutral-900 group-hover:text-black">Levix Store Admin</span>
                      <span className="px-1.5 py-0.2 bg-black text-white text-[9px] font-mono font-bold uppercase rounded-xs">
                        OWNER
                      </span>
                    </div>
                    <p className="text-neutral-500 text-[11px] font-mono mt-0.5">levixfashions@gmail.com</p>
                  </div>
                </div>
                <Shield className="w-4 h-4 text-[#FF5400]" />
              </button>

              {/* Account 2: Standard Customer Account */}
              <button
                onClick={() => executeGoogleLogin('customer@gmail.com')}
                disabled={loading}
                className="w-full p-3 rounded-lg border border-neutral-200 hover:border-black hover:bg-neutral-50 flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-neutral-900 group-hover:text-black">Streetwear Client</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] font-mono mt-0.5">customer@gmail.com</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
              </button>

              {/* Custom Google Account Option */}
              {showCustomInput ? (
                <form onSubmit={handleCustomGoogleSubmit} className="space-y-2 pt-2 border-t border-neutral-100">
                  <label className="block text-[11px] font-semibold text-neutral-600">
                    Enter Google Email:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      autoFocus
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="flex-1 border border-neutral-300 p-2 text-xs rounded-sm focus:border-black focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-3 py-2 bg-black text-white text-xs font-bold uppercase rounded-sm hover:bg-neutral-800"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full py-2.5 text-center text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
                >
                  + Use another Google account
                </button>
              )}

              <p className="text-[10px] text-neutral-400 text-center pt-2 leading-relaxed">
                Secured with Google OAuth protocol for LEVIX Luxury Streetwear.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};