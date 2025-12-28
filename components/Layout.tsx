
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  return (
    <div className="flex justify-center bg-black min-h-screen">
      <div className="relative w-full max-w-4xl bg-background-dark overflow-hidden flex flex-col h-screen md:rounded-[40px] md:my-8 md:shadow-2xl md:border-[12px] border-slate-900">
        
        <main className="flex-1 overflow-hidden flex flex-col relative">
          {children}
        </main>

        <nav className="shrink-0 bg-background-dark border-t border-slate-800 pb-8 pt-4 px-12 flex justify-between items-center z-50">
          <button 
            onClick={() => onViewChange(View.CHAT)}
            className={`flex flex-col items-center gap-1.5 transition-colors ${activeView === View.CHAT ? 'text-primary' : 'text-slate-500'}`}
          >
            <span className={`material-symbols-outlined text-2xl ${activeView === View.CHAT ? 'fill-1' : ''}`} style={{ fontVariationSettings: activeView === View.CHAT ? "'FILL' 1" : "'FILL' 0" }}>chat_bubble</span>
            <span className="text-[11px] font-semibold tracking-wide uppercase">Chat</span>
          </button>
          
          <button 
            onClick={() => onViewChange(View.NOTES)}
            className={`flex flex-col items-center gap-1.5 transition-colors ${activeView === View.NOTES ? 'text-primary' : 'text-slate-500'}`}
          >
            <span className={`material-symbols-outlined text-2xl ${activeView === View.NOTES ? 'fill-1' : ''}`} style={{ fontVariationSettings: activeView === View.NOTES ? "'FILL' 1" : "'FILL' 0" }}>folder</span>
            <span className="text-[11px] font-semibold tracking-wide uppercase">Notes</span>
          </button>
          
          <button 
            onClick={() => onViewChange(View.PROFILE)}
            className={`flex flex-col items-center gap-1.5 transition-colors ${activeView === View.PROFILE ? 'text-primary' : 'text-slate-500'}`}
          >
            <span className={`material-symbols-outlined text-2xl ${activeView === View.PROFILE ? 'fill-1' : ''}`} style={{ fontVariationSettings: activeView === View.PROFILE ? "'FILL' 1" : "'FILL' 0" }}>person</span>
            <span className="text-[11px] font-semibold tracking-wide uppercase">Profile</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
