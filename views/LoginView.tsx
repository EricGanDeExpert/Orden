import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  error?: string;
  isLoading?: boolean;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSwitchToSignup, error, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <div className="flex flex-col h-full bg-background-dark font-display overflow-y-auto no-scrollbar">
      <div className="flex-1 flex flex-col justify-center px-8 py-12">
        <div className="mb-12 text-center">
          <div className="size-20 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Welcome Back</h1>
          <p className="text-text-secondary-dark text-base">Sign in to continue your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-3 px-1">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl">mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-dark border border-slate-700 rounded-2xl py-4 pl-14 pr-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-3 px-1">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-dark border border-slate-700 rounded-2xl py-4 pl-14 pr-14 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800/50 rounded-2xl p-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">error</span>
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-primary font-bold hover:underline"
              disabled={isLoading}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      <p className="text-center text-[10px] font-bold tracking-[0.2em] text-slate-700 uppercase pb-8">Orden - AI Study Companion</p>
    </div>
  );
};

export default LoginView;
