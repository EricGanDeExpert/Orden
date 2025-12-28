
import React, { useState, useRef, useEffect } from 'react';
import { Message, Folder } from '../types';
import { getGeminiResponse } from '../services/geminiService';

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi Alex! I'm ready. I see you're working in Biology 101. Are we recording a lecture or reviewing notes?",
    timestamp: '9:41 AM'
  }
];

const FOLDERS: Folder[] = [
  { id: '1', name: 'Biology 101', icon: 'biotech' },
  { id: '2', name: 'Calc II', icon: 'functions' },
  { id: '3', name: 'World History', icon: 'history_edu' },
  { id: '4', name: 'CS 50', icon: 'code' },
];

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [activeFolderId, setActiveFolderId] = useState('1');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }]
    }));

    const aiResponse = await getGeminiResponse(inputValue, history);
    
    setIsTyping(false);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <div className="flex flex-col h-full bg-background-dark font-display">
      {/* Header */}
      <header className="flex items-center px-8 pt-10 pb-6 justify-between sticky top-0 bg-background-dark/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <div 
            className="size-12 rounded-full bg-center bg-cover ring-2 ring-primary/20 shadow-lg"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsme7JE3gaN2f3gJdOdg74xGRsRmzWs3Yp_rTwKGG0JHsBd-XTG6nqg6CQpoDTFjoKvpNA7-x18Xjqk6SVgUCO6fiAXoe1FBoQqMewEVSJjai56VxNNcFNNhCnLMT4pbX2KDFei5Plu35htqyktd8UZYsI9u2U_HTLYpphj70IaRZf0J0FDf49VqbViGDmnBFEDYmozT1zNujgolmVKxUzgd_0ckpvc8eEAx6UaTBHosQC6OkOaBvUEGu8VWJq04-pLfpHRL_xUNA")' }}
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xl font-bold leading-none text-white">Alex</p>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">Pro</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary-dark">
              <span className="material-symbols-outlined text-sm">school</span>
              <p className="text-sm font-medium">Stanford University</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center justify-center size-10 rounded-full bg-surface-dark border border-slate-800 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">history</span>
          </button>
          <button className="flex items-center justify-center size-10 rounded-full bg-surface-dark border border-slate-800 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>
      </header>

      {/* Tab Pills Section - Folders */}
      <div className="px-8 pb-4 border-b border-slate-800/30">
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
          {FOLDERS.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setActiveFolderId(folder.id)}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 px-5 rounded-full transition-all duration-200 border ${
                activeFolderId === folder.id
                  ? 'bg-white text-background-dark font-bold shadow-lg border-white'
                  : 'bg-[#232f48] text-slate-400 border-slate-700/50 hover:text-slate-200 font-medium'
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${activeFolderId === folder.id ? 'text-primary' : 'text-slate-500'}`}>
                {folder.icon}
              </span>
              <span className="text-sm whitespace-nowrap">{folder.name}</span>
            </button>
          ))}
          <button className="flex h-10 shrink-0 items-center justify-center size-10 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-xl">add</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-8 pb-64">
        <div className="flex justify-center my-4">
          <span className="text-[11px] font-bold tracking-widest uppercase text-text-secondary-dark bg-slate-800/30 px-4 py-1.5 rounded-full border border-slate-800/30">
            {new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {msg.role === 'assistant' && (
              <div className="size-9 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 mt-1">
                <span className="material-symbols-outlined text-white text-base">smart_toy</span>
              </div>
            )}
            <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
              <div className={`p-4 rounded-3xl shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-dark text-slate-200 border border-slate-800 rounded-tl-none'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              <span className="text-[10px] text-text-secondary-dark px-2">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
             <div className="size-9 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 mt-1">
                <span className="material-symbols-outlined text-white text-base">smart_toy</span>
              </div>
              <div className="bg-surface-dark p-4 rounded-3xl rounded-tl-none border border-slate-800 text-slate-400 flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:0.2s]">.</span>
                <span className="animate-bounce [animation-delay:0.4s]">.</span>
              </div>
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="fixed bottom-[110px] left-0 right-0 w-full max-w-4xl mx-auto z-40 px-6">
        <div className="bg-background-dark/95 backdrop-blur-xl border border-slate-800/50 rounded-[40px] p-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <p className="text-slate-400 text-sm font-medium flex items-center gap-3 bg-slate-800/50 px-5 py-2 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              Recording...
            </p>
          </div>
          
          <div className="flex items-center justify-between gap-6">
            <button className="flex flex-col items-center group w-16 transition-transform active:scale-95">
              <div className="size-14 rounded-full bg-surface-dark border border-slate-800 shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary transition-all">
                <span className="material-symbols-outlined text-2xl">keyboard</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-3 group-hover:text-slate-300">Type</span>
            </button>

            <div className="relative flex-1 flex justify-center">
              <button 
                onClick={handleSendMessage}
                disabled={isTyping}
                className={`relative size-28 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 group mx-2 ${isTyping ? 'bg-slate-700 opacity-50' : 'bg-primary shadow-primary/40'}`}
              >
                <span className="absolute -inset-1.5 rounded-full border border-primary/20 group-hover:border-primary/40 transition-colors"></span>
                <span className="absolute -inset-3 rounded-full border border-primary/10 group-hover:border-primary/20 transition-colors"></span>
                <span className="material-symbols-outlined text-white text-5xl group-hover:scale-110 transition-transform">mic</span>
              </button>
              
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask a question..."
                  className="w-full bg-surface-dark border-none rounded-full px-6 py-4 text-white pointer-events-auto shadow-2xl ring-2 ring-primary/50"
                />
              </div>
            </div>

            <button className="flex flex-col items-center group w-16 transition-transform active:scale-95">
              <div className="size-14 rounded-full bg-surface-dark border border-slate-800 shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary transition-all">
                <span className="material-symbols-outlined text-2xl">upload_file</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-3 group-hover:text-slate-300">Upload</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
