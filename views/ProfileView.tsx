
import React from 'react';

const ProfileView: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-background-dark font-display overflow-y-auto no-scrollbar">
      <header className="flex items-center justify-between px-8 pt-12 pb-6 sticky top-0 z-20 bg-background-dark/80 backdrop-blur-md">
        <button className="flex items-center justify-center size-12 -ml-3 rounded-full hover:bg-white/10 transition-colors text-white">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Profile</h1>
        <button className="flex items-center justify-center size-12 -mr-3 rounded-full hover:bg-white/10 transition-colors text-white">
          <span className="material-symbols-outlined text-2xl">more_horiz</span>
        </button>
      </header>

      <main className="flex-1 px-8 pb-10">
        <div className="flex flex-col items-center mb-10 mt-2">
          <div className="relative mb-6 group cursor-pointer">
            <div 
              className="size-32 rounded-full bg-cover bg-center ring-4 ring-surface-dark shadow-2xl"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsme7JE3gaN2f3gJdOdg74xGRsRmzWs3Yp_rTwKGG0JHsBd-XTG6nqg6CQpoDTFjoKvpNA7-x18Xjqk6SVgUCO6fiAXoe1FBoQqMewEVSJjai56VxNNcFNNhCnLMT4pbX2KDFei5Plu35htqyktd8UZYsI9u2U_HTLYpphj70IaRZf0J0FDf49VqbViGDmnBFEDYmozT1zNujgolmVKxUzgd_0ckpvc8eEAx6UaTBHosQC6OkOaBvUEGu8VWJq04-pLfpHRL_xUNA")' }}
            />
            <div className="absolute bottom-1 right-1 size-10 rounded-full bg-primary flex items-center justify-center border-4 border-surface-dark shadow-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-base">edit</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Alex Johnson</h2>
          <p className="text-text-secondary-dark text-base font-medium">alex.j@university.edu</p>
        </div>

        <div className="mb-12">
          <div className="bg-primary rounded-[32px] p-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-colors duration-500"></div>
            <div className="absolute -left-10 -bottom-10 size-40 rounded-full bg-blue-400/20 blur-2xl"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest mb-2">Current Plan</p>
                <h3 className="text-3xl font-bold flex items-center gap-3">
                  Student Pro
                  <span className="material-symbols-outlined text-yellow-300 fill-1 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </h3>
              </div>
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10">Active</span>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-sm items-end font-bold">
                <span className="text-blue-100 uppercase tracking-wide text-[11px]">AI Generation Credits</span>
                <span className="text-2xl">850<span className="text-blue-200 text-sm font-normal">/1000</span></span>
              </div>
              <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-white w-[85%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-1000 ease-out"></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <p className="text-[11px] text-blue-200 font-medium">Renews on Oct 24, 2023</p>
                <button className="text-[11px] font-bold bg-white text-primary px-5 py-2.5 rounded-xl shadow-lg hover:bg-blue-50 transition-all active:scale-95">Manage</button>
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
              <button className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group border-b border-slate-800/50">
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

          <button className="w-full py-5 rounded-2xl border-2 border-red-900/30 text-red-500 font-bold text-base hover:bg-red-900/20 transition-all flex items-center justify-center gap-3 active:scale-95 mb-8">
            <span className="material-symbols-outlined text-2xl">logout</span>
            Log Out
          </button>
          
          <p className="text-center text-[10px] font-bold tracking-[0.2em] text-slate-700 uppercase mb-8">Version 2.4.1 (Build 203)</p>
        </div>
      </main>
    </div>
  );
};

export default ProfileView;
