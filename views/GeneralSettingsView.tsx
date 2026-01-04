import React, { useState } from 'react';
import { User } from '../types';

interface GeneralSettingsViewProps {
  user: User;
  onBack: () => void;
  onUpdateUsername: (newUsername: string) => Promise<{ success: boolean; error?: string }>;
  onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const GeneralSettingsView: React.FC<GeneralSettingsViewProps> = ({
  user,
  onBack,
  onUpdateUsername,
  onUpdatePassword,
}) => {
  const [username, setUsername] = useState(user.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [usernameMessage, setUsernameMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdateUsername = async () => {
    if (username === user.username) {
      setUsernameMessage({ type: 'error', text: 'Username is the same as current' });
      return;
    }

    if (username.length < 2) {
      setUsernameMessage({ type: 'error', text: 'Username must be at least 2 characters' });
      return;
    }

    setIsUpdatingUsername(true);
    setUsernameMessage(null);

    const result = await onUpdateUsername(username);
    setIsUpdatingUsername(false);

    if (result.success) {
      setUsernameMessage({ type: 'success', text: 'Username updated successfully!' });
    } else {
      setUsernameMessage({ type: 'error', text: result.error || 'Failed to update username' });
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordMessage(null);

    if (!currentPassword) {
      setPasswordMessage({ type: 'error', text: 'Please enter your current password' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setIsUpdatingPassword(true);

    const result = await onUpdatePassword(currentPassword, newPassword);
    setIsUpdatingPassword(false);

    if (result.success) {
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMessage({ type: 'error', text: result.error || 'Failed to update password' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark font-display overflow-y-auto no-scrollbar">
      <header className="flex items-center justify-between px-8 pt-12 pb-6 sticky top-0 z-20 bg-background-dark/80 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center justify-center size-12 -ml-3 rounded-full hover:bg-white/10 transition-colors text-white"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">General Settings</h1>
        <div className="size-12" />
      </header>

      <main className="flex-1 px-8 pb-10">
        {/* Username Section */}
        <section className="mb-10">
          <h3 className="text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-4 px-2">
            Username
          </h3>
          <div className="bg-surface-dark rounded-3xl p-6 border border-slate-800">
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-3 px-1">
                Display Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                  person
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-background-dark border border-slate-700 rounded-2xl py-4 pl-14 pr-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter username"
                  disabled={isUpdatingUsername}
                />
              </div>
            </div>

            {usernameMessage && (
              <div
                className={`mb-4 p-4 rounded-2xl flex items-center gap-3 ${
                  usernameMessage.type === 'success'
                    ? 'bg-green-900/20 border border-green-800/50'
                    : 'bg-red-900/20 border border-red-800/50'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    usernameMessage.type === 'success' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {usernameMessage.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <p
                  className={`text-sm font-medium ${
                    usernameMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {usernameMessage.text}
                </p>
              </div>
            )}

            <button
              onClick={handleUpdateUsername}
              disabled={isUpdatingUsername || username === user.username}
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isUpdatingUsername ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Updating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  Update Username
                </>
              )}
            </button>
          </div>
        </section>

        {/* Password Section */}
        <section className="mb-10">
          <h3 className="text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-4 px-2">
            Password
          </h3>
          <div className="bg-surface-dark rounded-3xl p-6 border border-slate-800 space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-3 px-1">
                Current Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                  lock
                </span>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-background-dark border border-slate-700 rounded-2xl py-4 pl-14 pr-14 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter current password"
                  disabled={isUpdatingPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showCurrentPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-3 px-1">
                New Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                  lock
                </span>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-background-dark border border-slate-700 rounded-2xl py-4 pl-14 pr-14 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter new password (min 6 characters)"
                  disabled={isUpdatingPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showNewPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-3 px-1">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                  lock
                </span>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-background-dark border border-slate-700 rounded-2xl py-4 pl-14 pr-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Confirm new password"
                  disabled={isUpdatingPassword}
                />
              </div>
            </div>

            {passwordMessage && (
              <div
                className={`p-4 rounded-2xl flex items-center gap-3 ${
                  passwordMessage.type === 'success'
                    ? 'bg-green-900/20 border border-green-800/50'
                    : 'bg-red-900/20 border border-red-800/50'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    passwordMessage.type === 'success' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {passwordMessage.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <p
                  className={`text-sm font-medium ${
                    passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {passwordMessage.text}
                </p>
              </div>
            )}

            <button
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isUpdatingPassword ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Updating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">password</span>
                  Update Password
                </>
              )}
            </button>
          </div>
        </section>

        {/* Account Info */}
        <section>
          <h3 className="text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-4 px-2">
            Account Info
          </h3>
          <div className="bg-surface-dark rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400 text-sm">Email</span>
              <span className="text-white font-medium">{user.email}</span>
            </div>
            <div className="border-t border-slate-700/50" />
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400 text-sm">Account Created</span>
              <span className="text-white font-medium">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="border-t border-slate-700/50" />
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400 text-sm">Plan</span>
              <span className="text-primary font-bold">{user.plan}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GeneralSettingsView;
