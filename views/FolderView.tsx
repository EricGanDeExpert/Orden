
import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { getNotesByFolder, getFolderById, getNoteCount } from '../services/notesService';

interface FolderViewProps {
  folderId: string;
  onBack: () => void;
  onNoteSelect: (note: Note) => void;
  onAddNote: (note: Note) => void;
}

const FolderView: React.FC<FolderViewProps> = ({ folderId, onBack, onNoteSelect, onAddNote }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteType, setNewNoteType] = useState<Note['type']>('article');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showNoteMenu, setShowNoteMenu] = useState<string | null>(null);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const folder = getFolderById(folderId);
  const noteCount = getNoteCount(folderId);

  // Load notes when component mounts or folderId changes
  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);
      const notes = await getNotesByFolder(folderId);
      setAllNotes(notes);
      setIsLoading(false);
    };
    loadNotes();
  }, [folderId]);

  const tabs = [
    { name: 'All', icon: 'apps' },
    { name: 'Summaries', icon: 'auto_awesome' },
    { name: 'Articles', icon: 'article' },
    { name: 'Tasks', icon: 'check_circle' }
  ];

  const noteTypes: { type: Note['type']; label: string; icon: string }[] = [
    { type: 'article', label: 'Article', icon: 'article' },
    { type: 'summary', label: 'Summary', icon: 'auto_awesome' },
    { type: 'tasks', label: 'Task List', icon: 'check_circle' },
    { type: 'slides', label: 'Slides', icon: 'image' },
  ];

  // Filter notes based on active tab and search query
  const filteredNotes = allNotes.filter((note: Note) => {
    const matchesTab = activeTab === 'All' ||
      (activeTab === 'Summaries' && note.type === 'summary') ||
      (activeTab === 'Articles' && (note.type === 'article' || note.type === 'slides')) ||
      (activeTab === 'Tasks' && note.type === 'tasks');

    const matchesSearch = searchQuery === '' ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.preview?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const handleAddNote = () => {
    if (!newNoteTitle.trim()) return;

    const newNote: Note = {
      id: `new-${Date.now()}`,
      type: newNoteType,
      title: newNoteTitle,
      subtitle: newNoteType === 'tasks' ? '0/0 Completed' : 'Just created',
      content: newNoteContent,
      date: 'Just now',
      tags: [],
      progress: newNoteType === 'tasks' ? {
        completed: 0,
        total: 0,
        items: []
      } : undefined
    };

    onAddNote(newNote);
    setShowAddModal(false);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteType('article');
  };

  const handleVoiceSearch = () => {
    // Voice search placeholder
    alert('Voice search coming soon! For now, type your search query.');
  };

  return (
    <div className="flex flex-col h-full bg-background-dark font-display overflow-y-auto no-scrollbar">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background-dark/95 backdrop-blur-md p-6 border-b border-slate-800/50">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all text-white"
          >
            <span className="material-symbols-outlined text-[28px]">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined text-2xl ${folderId === 'biology' ? 'text-green-400' : 'text-orange-400'}`}>
                {folder?.icon || 'folder'}
              </span>
              <h2 className="text-white text-2xl font-bold tracking-tight">{folder?.name || 'Notes'}</h2>
            </div>
            <span className="text-xs text-text-secondary-dark font-semibold uppercase tracking-wider mt-1">
              {noteCount} notes • Last edited 2h ago
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-white hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
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
              placeholder={`Search inside ${folder?.name || 'Notes'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="flex items-center justify-center pr-3 text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
            <button
              onClick={handleVoiceSearch}
              className="flex items-center justify-center pr-5 pl-3 text-primary hover:text-primary/80 transition-colors"
            >
              <span className="material-symbols-outlined text-[28px]">mic</span>
            </button>
          </div>
        </label>
      </div>

      {/* Segmented Tab Pills Section */}
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
              <span className={`material-symbols-outlined text-lg ${activeTab === tab.name ? 'text-primary' : 'text-slate-500'}`}>
                {tab.icon}
              </span>
              <span className="text-sm whitespace-nowrap">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Note Cards List */}
      <div className="flex flex-col gap-4 p-6 pb-40">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="material-symbols-outlined text-primary text-5xl animate-spin mb-4">progress_activity</span>
            <p className="text-slate-400 font-medium">Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-slate-600">
                {searchQuery ? 'search_off' : 'note_add'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-400 mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                Add Note
              </button>
            )}
          </div>
        ) : (
          filteredNotes.map((note: Note) => (
            <div
              key={note.id}
              onClick={() => onNoteSelect(note)}
              className="group relative flex flex-col gap-4 rounded-3xl bg-surface-dark p-6 shadow-sm border border-slate-800 transition-all hover:border-primary/30 hover:shadow-xl active:scale-[0.99] cursor-pointer animate-fade-in"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className={`flex items-center justify-center h-12 w-12 rounded-2xl shrink-0 ${
                    note.type === 'summary' ? 'bg-blue-900/30 text-blue-400' :
                    note.type === 'slides' ? 'bg-green-900/30 text-green-400' :
                    note.type === 'audio' ? 'bg-orange-900/30 text-orange-400' :
                    note.type === 'article' ? 'bg-purple-900/30 text-purple-400' : 'bg-pink-900/30 text-pink-400'
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
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNoteMenu(showNoteMenu === note.id ? null : note.id);
                    }}
                    className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-500"
                  >
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                  {showNoteMenu === note.id && (
                    <div className="absolute right-0 top-12 bg-surface-dark border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[160px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNoteMenu(null);
                          onNoteSelect(note);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-300 hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">visibility</span>
                        <span className="text-sm font-medium">View</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNoteMenu(null);
                          alert('Share functionality coming soon!');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-300 hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">share</span>
                        <span className="text-sm font-medium">Share</span>
                      </button>
                      <div className="border-t border-slate-700" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNoteMenu(null);
                          alert('Delete functionality available in note detail view.');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-900/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pl-16">
                {note.preview && (
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{note.preview}</p>
                )}
                {note.image && (
                  <div className="rounded-2xl overflow-hidden h-32 w-full max-w-sm mb-2 border border-slate-800">
                    <img src={note.image} className="w-full h-full object-cover" alt="note visual" />
                  </div>
                )}
                {note.type === 'audio' && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-3 rounded-full bg-slate-800/50 p-3 pr-6 w-fit border border-slate-700"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Audio playback coming soon!');
                      }}
                      className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 text-primary shadow-lg hover:bg-slate-600 transition-colors"
                    >
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
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500 font-medium">Progress</span>
                      <span className="text-xs text-primary font-bold">{note.progress.completed}/{note.progress.total}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${note.progress.total > 0 ? (note.progress.completed / note.progress.total) * 100 : 0}%` }}
                      />
                    </div>
                    {note.progress.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-xl ${item.done ? 'text-green-500' : 'text-slate-600'}`}>
                          {item.done ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                        <span className={`text-sm ${item.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.label}</span>
                      </div>
                    ))}
                    {note.progress.items.length > 3 && (
                      <p className="text-xs text-slate-500 pl-8">+{note.progress.items.length - 3} more tasks</p>
                    )}
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
          ))
        )}
      </div>

      {/* Click outside to close note menu */}
      {showNoteMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNoteMenu(null)}
        />
      )}

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-surface-dark rounded-3xl p-8 w-full max-w-lg border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Note</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Note Type Selection */}
              <div>
                <label className="block text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-3">
                  Note Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {noteTypes.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => setNewNoteType(type.type)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                        newNoteType === type.type
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">{type.icon}</span>
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-3">
                  Title
                </label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full bg-background-dark border border-slate-700 rounded-2xl py-4 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter note title..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-[11px] font-bold text-text-secondary-dark uppercase tracking-[0.2em] mb-3">
                  Content {newNoteType === 'tasks' && '(Enter tasks, one per line)'}
                </label>
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={6}
                  className="w-full bg-background-dark border border-slate-700 rounded-2xl py-4 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder={newNoteType === 'tasks' ? 'Enter each task on a new line...' : 'Start writing your note...'}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  disabled={!newNoteTitle.trim()}
                  className="flex-1 py-4 rounded-2xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">add</span>
                  Create Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderView;
