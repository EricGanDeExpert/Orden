import React, { useState, useRef } from 'react';
import { User } from '../types';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
  onAvatarChange: (avatarUrl: string) => Promise<void>;
  onGeneralSettings: () => void;
}

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Nala',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
];

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onAvatarChange, onGeneralSettings }) => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = async (avatarUrl: string) => {
    setIsChangingAvatar(true);
    await onAvatarChange(avatarUrl);
    setIsChangingAvatar(false);
    setShowAvatarModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        await handleAvatarSelect(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const creditPercentage = (user.credits / user.maxCredits) * 100;

  return (
    <div className="flex flex-col h-full bg-background-dark font-display overflow-y-auto no-scrollbar">
      <header className="flex items-center justify-between px-8 pt-12 pb-6 sticky top-0 z-20 bg-background-dark/80 backdrop-blur-md">
        <div className="size-12" />
        <h1 className="text-lg font-bold">Profile</h1>
        <button className="flex items-center justify-center size-12 -mr-3 rounded-full hover:bg-white/10 transition-colors text-white">
          <span className="material-symbols-outlined text-2xl">more_horiz</span>
        </button>
      </header>

      <main className="flex-1 px-8 pb-10">
        <div className="flex flex-col items-center mb-10 mt-2">
          <div className="relative mb-6 group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
            <div
              className="size-32 rounded-full bg-cover bg-center ring-4 ring-surface-dark shadow-2xl bg-slate-700"
              style={{ backgroundImage: `url("${user.avatarUrl}")` }}
            />
            <div className="absolute bottom-1 right-1 size-10 rounded-full bg-primary flex items-center justify-center border-4 border-surface-dark shadow-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-base">edit</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{user.username}</h2>
          <p className="text-text-secondary-dark text-base font-medium">{user.email}</p>
        </div>

        <div className="mb-12">
          <div className="bg-primary rounded-[32px] p-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-colors duration-500"></div>
            <div className="absolute -left-10 -bottom-10 size-40 rounded-full bg-blue-400/20 blur-2xl"></div>

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest mb-2">Current Plan</p>
                <h3 className="text-3xl font-bold flex items-center gap-3">
                  {user.plan}
                  {user.plan !== 'Free' && (
                    <span className="material-symbols-outlined text-yellow-300 fill-1 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  )}
                </h3>
              </div>
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10">Active</span>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-sm items-end font-bold">
                <span className="text-blue-100 uppercase tracking-wide text-[11px]">AI Generation Credits</span>
                <span className="text-2xl">{user.credits}<span className="text-blue-200 text-sm font-normal">/{user.maxCredits}</span></span>
              </div>
              <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-1000 ease-out"
                  style={{ width: `${creditPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <p className="text-[11px] text-blue-200 font-medium">Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <button className="text-[11px] font-bold bg-white text-primary px-5 py-2.5 rounded-xl shadow-lg hover:bg-blue-50 transition-all active:scale-95">Upgrade</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <section>
            <h3 className="text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-4 px-2">Account</h3>
            <div className="bg-surface-dark rounded-3xl overflow-hidden border border-slate-800 shadow-sm">
              <button className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group border-b border-slate-800/50">
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-full bg-blue-900/20 text-blue-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">person</span>
                  </div>
                  <div className="text-left">
                    <p className="text-base font-bold text-white">Personal Details</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Name, bio, contact info</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors text-2xl">chevron_right</span>
              </button>
              <button className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-full bg-purple-900/20 text-purple-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">history</span>
                  </div>
                  <div className="text-left">
                    <p className="text-base font-bold text-white">Account History</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Logins, device activity</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors text-2xl">chevron_right</span>
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-4 px-2">App Settings</h3>
            <div className="bg-surface-dark rounded-3xl overflow-hidden border border-slate-800 shadow-sm">
              <button
                onClick={onGeneralSettings}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group border-b border-slate-800/50"
              >
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">settings</span>
                  </div>
                  <span className="text-base font-bold text-white">General</span>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors text-2xl">chevron_right</span>
              </button>
              <button className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group border-b border-slate-800/50">
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-full bg-orange-900/20 text-orange-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">notifications</span>
                  </div>
                  <span className="text-base font-bold text-white">Notifications</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="size-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors text-2xl">chevron_right</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-full bg-green-900/20 text-green-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">cloud</span>
                  </div>
                  <span className="text-base font-bold text-white">Storage & Data</span>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors text-2xl">chevron_right</span>
              </button>
            </div>
          </section>

          <button
            onClick={onLogout}
            className="w-full py-5 rounded-2xl border-2 border-red-900/30 text-red-500 font-bold text-base hover:bg-red-900/20 transition-all flex items-center justify-center gap-3 active:scale-95 mb-8"
          >
            <span className="material-symbols-outlined text-2xl">logout</span>
            Log Out
          </button>

          <p className="text-center text-[10px] font-bold tracking-[0.2em] text-slate-700 uppercase mb-8">Version 2.4.1 (Build 203)</p>
        </div>
      </main>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-surface-dark rounded-3xl p-8 w-full max-w-md border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Change Avatar</h2>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>

            <p className="text-slate-400 text-sm mb-6">Choose from presets or upload your own image</p>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {AVATAR_OPTIONS.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => handleAvatarSelect(avatar)}
                  disabled={isChangingAvatar}
                  className={`size-16 rounded-full bg-cover bg-center ring-2 ring-transparent hover:ring-primary transition-all ${
                    user.avatarUrl === avatar ? 'ring-primary ring-4' : ''
                  } ${isChangingAvatar ? 'opacity-50' : ''}`}
                  style={{ backgroundImage: `url("${avatar}")` }}
                />
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isChangingAvatar}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-600 text-slate-400 font-medium hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">upload</span>
              Upload Custom Image
            </button>

            {isChangingAvatar && (
              <div className="mt-4 flex items-center justify-center gap-2 text-primary">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                <span className="text-sm">Updating avatar...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
