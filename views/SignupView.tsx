import React, { useState } from 'react';

interface SignupViewProps {
  onSignup: (email: string, password: string, username: string) => Promise<void>;
  onSwitchToLogin: () => void;
  error?: string;
  isLoading?: boolean;
}

const SignupView: React.FC<SignupViewProps> = ({ onSignup, onSwitchToLogin, error, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    await onSignup(email, password, username);
  };

  const displayError = localError || error;

  return (
    <div className="flex flex-col h-full bg-background-dark font-display overflow-y-auto no-scrollbar">
      <div className="flex-1 flex flex-col justify-center px-8 py-12">
        <div className="mb-10 text-center">
          <div className="size-20 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Create Account</h1>
          <p className="text-text-secondary-dark text-base">Start your AI-powered study journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-2 px-1">Username</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl">person</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface-dark border border-slate-700 rounded-2xl py-4 pl-14 pr-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Choose a username"
                required
                disabled={isLoading}
                minLength={2}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-2 px-1">Email</label>
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
            <label className="block text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-2 px-1">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-dark border border-slate-700 rounded-2xl py-4 pl-14 pr-14 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Create a password (min 6 characters)"
                required
                disabled={isLoading}
                minLength={6}
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

          <div>
            <label className="block text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-2 px-1">Confirm Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface-dark border border-slate-700 rounded-2xl py-4 pl-14 pr-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Confirm your password"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </div>

          {displayError && (
            <div className="bg-red-900/20 border border-red-800/50 rounded-2xl p-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">error</span>
              <p className="text-red-400 text-sm font-medium">{displayError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary font-bold hover:underline"
              disabled={isLoading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      <p className="text-center text-[10px] font-bold tracking-[0.2em] text-slate-700 uppercase pb-8">Orden - AI Study Companion</p>
    </div>
  );
};

export default SignupView;
