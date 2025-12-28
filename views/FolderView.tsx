
import React, { useState } from 'react';
import { Note } from '../types';

const NOTES: Note[] = [
  {
    id: '1',
    type: 'summary',
    title: 'Cell Structure Summary',
    subtitle: 'Generated from lecture recording',
    content: 'Key differences between prokaryotic and eukaryotic cells include the presence of a nucleus and membrane-bound organelles. Mitochondria are the powerhouse...',
    date: '2h ago',
    tags: ['#exam-prep']
  },
  {
    id: '2',
    type: 'slides',
    title: 'Lab: Microscope Slides',
    subtitle: "Photos from today's session",
    date: 'Yesterday',
    image: 'https://picsum.photos/seed/bio/400/200'
  },
  {
    id: '3',
    type: 'audio',
    title: 'Dr. Smith Guest Lecture',
    subtitle: 'Audio recording • 45m 12s',
    date: 'Oct 24'
  },
  {
    id: '4',
    type: 'article',
    title: 'Mitosis vs Meiosis',
    subtitle: 'Study notes',
    content: 'Mitosis results in two identical daughter cells, whereas meiosis results in four genetically unique haploid cells. Crucial for reproduction...',
    date: 'Oct 22'
  },
  {
    id: '5',
    type: 'tasks',
    title: 'Midterm Project Tasks',
    subtitle: '3/5 Completed',
    date: 'Oct 20',
    progress: {
      completed: 3,
      total: 5,
      items: [
        { label: 'Select topic', done: true },
        { label: 'Draft outline', done: true },
        { label: 'Gather sources', done: false }
      ]
    }
  }
];

const FolderView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = [
    { name: 'All', icon: 'apps' },
    { name: 'Transcripts', icon: 'description' },
    { name: 'Summaries', icon: 'auto_awesome' },
    { name: 'Audio', icon: 'mic' }
  ];

  return (
    <div className="flex flex-col h-full bg-background-dark font-display overflow-y-auto no-scrollbar">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background-dark/95 backdrop-blur-md p-6 border-b border-slate-800/50">
        <div className="flex items-center gap-4">
          <button className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all text-white">
            <span className="material-symbols-outlined text-[28px]">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <h2 className="text-white text-2xl font-bold tracking-tight">Biology 101</h2>
            <span className="text-xs text-text-secondary-dark font-semibold uppercase tracking-wider">12 notes • Last edited 5h ago</span>
          </div>
        </div>
        <button className="flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-white hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[22px] mr-2">post_add</span>
          <span className="text-sm font-bold uppercase tracking-wide">Add Note</span>
        </button>
      </header>

      {/* Search Section */}
      <div className="px-6 py-6">
        <label className="group flex flex-col w-full">
          <div className="flex w-full items-center rounded-[20px] bg-[#232f48] shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary h-14">
            <div className="flex items-center justify-center pl-5 pr-3 text-[#92a4c9]">
              <span className="material-symbols-outlined text-[28px]">search</span>
            </div>
            <input 
              className="flex w-full flex-1 bg-transparent text-white placeholder:text-[#92a4c9] focus:outline-none text-base font-medium h-full border-none focus:ring-0" 
              placeholder="Search inside Biology 101..."
            />
            <button className="flex items-center justify-center pr-5 pl-3 text-primary hover:text-primary/80 transition-colors">
              <span className="material-symbols-outlined text-[28px]">mic</span>
            </button>
          </div>
        </label>
      </div>

      {/* Segmented Tab Pills Section - matching reference image */}
      <div className="px-6 pb-6">
        <div className="flex bg-[#161c2b] p-1.5 rounded-full overflow-x-auto no-scrollbar border border-slate-800/50 w-full">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex h-11 shrink-0 items-center justify-center gap-x-2 px-6 rounded-full transition-all duration-200 ${
                activeTab === tab.name 
                  ? 'bg-white text-background-dark font-bold shadow-lg scale-[1.02]' 
                  : 'bg-[#232f48] text-slate-400 hover:text-slate-200 font-medium ml-2 first:ml-0'
              }`}
            >
              {tab.name === 'All' && activeTab === 'All' && (
                <span className="material-symbols-outlined text-xl">biology</span>
              )}
              {tab.name !== 'All' && (
                <span className={`material-symbols-outlined text-lg ${activeTab === tab.name ? 'text-primary' : 'text-slate-500'}`}>
                  {tab.icon}
                </span>
              )}
              <span className="text-sm whitespace-nowrap">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Note Cards List */}
      <div className="flex flex-col gap-4 p-6 pb-40">
        {NOTES.map((note) => (
          <div key={note.id} className="group relative flex flex-col gap-4 rounded-3xl bg-surface-dark p-6 shadow-sm border border-slate-800 transition-all hover:border-primary/30 hover:shadow-xl active:scale-[0.99] cursor-pointer animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className={`flex items-center justify-center h-12 w-12 rounded-2xl shrink-0 ${
                  note.type === 'summary' ? 'bg-blue-900/30 text-blue-400' :
                  note.type === 'slides' ? 'bg-green-900/30 text-green-400' :
                  note.type === 'audio' ? 'bg-orange-900/30 text-orange-400' :
                  note.type === 'article' ? 'bg-slate-700 text-slate-400' : 'bg-pink-900/30 text-pink-400'
                }`}>
                  <span className="material-symbols-outlined">{
                    note.type === 'summary' ? 'auto_awesome' :
                    note.type === 'slides' ? 'image' :
                    note.type === 'audio' ? 'mic' :
                    note.type === 'article' ? 'article' : 'check_circle'
                  }</span>
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold leading-tight">{note.title}</h3>
                  <p className="text-sm text-text-secondary-dark mt-1 font-medium">{note.subtitle}</p>
                </div>
              </div>
              <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-500">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>

            <div className="pl-16">
              {note.content && (
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{note.content}</p>
              )}
              {note.image && (
                <div className="rounded-2xl overflow-hidden h-32 w-full max-w-sm mb-2 border border-slate-800">
                  <img src={note.image} className="w-full h-full object-cover" alt="note visual" />
                </div>
              )}
              {note.type === 'audio' && (
                <div className="flex items-center gap-3 rounded-full bg-slate-800/50 p-3 pr-6 w-fit border border-slate-700">
                   <button className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 text-primary shadow-lg">
                      <span className="material-symbols-outlined text-2xl">play_arrow</span>
                   </button>
                   <div className="flex gap-1 items-center h-5">
                      <div className="w-1.5 h-4 bg-primary/40 rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-6 bg-primary/60 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-5 bg-primary/40 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                      <div className="w-1.5 h-8 bg-primary rounded-full animate-pulse [animation-delay:0.1s]"></div>
                   </div>
                   <span className="text-xs font-mono text-slate-400 ml-4">12:40</span>
                </div>
              )}
              {note.progress && (
                <div className="space-y-3 mt-2">
                  {note.progress.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-xl ${item.done ? 'text-green-500' : 'text-slate-600'}`}>
                        {item.done ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span className={`text-sm ${item.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-400">
                  <span className="material-symbols-outlined text-sm">schedule</span> {note.date}
                </span>
                {note.tags?.map(tag => (
                   <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-900/30 text-xs font-bold text-purple-400">
                      {tag}
                   </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderView;
