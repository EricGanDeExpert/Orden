
import React, { useState } from 'react';
import { Note } from '../types';

interface NoteDetailViewProps {
  note: Note;
  onBack: () => void;
  onUpdateNote: (updatedNote: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

const NoteDetailView: React.FC<NoteDetailViewProps> = ({ note, onBack, onUpdateNote, onDeleteNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // For task notes, manage checkbox states
  const [taskItems, setTaskItems] = useState(note.progress?.items || []);

  const handleSave = () => {
    const updatedNote: Note = {
      ...note,
      title: editedTitle,
      content: editedContent,
      progress: note.progress ? {
        ...note.progress,
        items: taskItems,
        completed: taskItems.filter(item => item.done).length
      } : undefined
    };
    onUpdateNote(updatedNote);
    setIsEditing(false);
  };

  const handleToggleTask = (index: number) => {
    const newItems = [...taskItems];
    newItems[index] = { ...newItems[index], done: !newItems[index].done };
    setTaskItems(newItems);

    // Auto-save task changes
    const updatedNote: Note = {
      ...note,
      progress: {
        ...note.progress!,
        items: newItems,
        completed: newItems.filter(item => item.done).length
      }
    };
    onUpdateNote(updatedNote);
  };

  const handleDelete = () => {
    onDeleteNote(note.id);
    onBack();
  };

  const getTypeIcon = () => {
    switch (note.type) {
      case 'summary': return 'auto_awesome';
      case 'slides': return 'image';
      case 'audio': return 'mic';
      case 'article': return 'article';
      case 'tasks': return 'check_circle';
      default: return 'description';
    }
  };

  const getTypeColor = () => {
    switch (note.type) {
      case 'summary': return 'text-blue-400 bg-blue-900/30';
      case 'slides': return 'text-green-400 bg-green-900/30';
      case 'audio': return 'text-orange-400 bg-orange-900/30';
      case 'article': return 'text-purple-400 bg-purple-900/30';
      case 'tasks': return 'text-pink-400 bg-pink-900/30';
      default: return 'text-slate-400 bg-slate-800';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark font-display overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background-dark/95 backdrop-blur-md p-6 border-b border-slate-800/50">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all text-white"
          >
            <span className="material-symbols-outlined text-[28px]">arrow_back</span>
          </button>
          <div className={`flex items-center justify-center h-10 w-10 rounded-xl ${getTypeColor()}`}>
            <span className="material-symbols-outlined text-xl">{getTypeIcon()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(note.title);
                  setEditedContent(note.content || '');
                }}
                className="flex items-center justify-center px-4 py-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                <span className="text-sm font-medium">Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center justify-center px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-lg mr-1">save</span>
                <span className="text-sm font-medium">Save</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center size-10 rounded-full bg-surface-dark border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-xl">edit</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="flex items-center justify-center size-10 rounded-full bg-surface-dark border border-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">more_vert</span>
                </button>
                {showMoreMenu && (
                  <div className="absolute right-0 top-12 bg-surface-dark border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[180px]">
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        // Share functionality placeholder
                        alert('Share functionality coming soon!');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-300 hover:bg-white/5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">share</span>
                      <span className="text-sm font-medium">Share</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        // Duplicate functionality placeholder
                        alert('Duplicate functionality coming soon!');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-300 hover:bg-white/5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">content_copy</span>
                      <span className="text-sm font-medium">Duplicate</span>
                    </button>
                    <div className="border-t border-slate-700" />
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-6 pb-40">
        {/* Title */}
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full bg-transparent text-3xl font-bold text-white mb-4 focus:outline-none border-b-2 border-primary pb-2"
            placeholder="Note title..."
          />
        ) : (
          <h1 className="text-3xl font-bold text-white mb-4">{note.title}</h1>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-400">
            <span className="material-symbols-outlined text-sm">schedule</span> {note.date}
          </span>
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getTypeColor()} text-xs font-bold capitalize`}>
            <span className="material-symbols-outlined text-sm">{getTypeIcon()}</span> {note.type}
          </span>
          {note.tags?.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-900/30 text-xs font-bold text-purple-400">
              {tag}
            </span>
          ))}
        </div>

        {/* Image if present */}
        {note.image && (
          <div className="rounded-3xl overflow-hidden mb-6 border border-slate-800">
            <img src={note.image} className="w-full h-auto object-cover" alt={note.title} />
          </div>
        )}

        {/* Content based on type */}
        {note.type === 'tasks' && note.progress ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Tasks</h2>
              <span className="text-sm text-primary font-bold">
                {taskItems.filter(item => item.done).length}/{taskItems.length} completed
              </span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(taskItems.filter(item => item.done).length / taskItems.length) * 100}%` }}
              />
            </div>
            <div className="space-y-2">
              {taskItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleToggleTask(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    item.done
                      ? 'bg-green-900/10 border-green-800/30'
                      : 'bg-surface-dark border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className={`material-symbols-outlined text-2xl ${item.done ? 'text-green-500' : 'text-slate-600'}`}>
                    {item.done ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span className={`text-base text-left flex-1 ${item.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : note.type === 'audio' ? (
          <div className="space-y-6">
            <div className="bg-surface-dark rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center gap-4 mb-6">
                <button className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-3xl">play_arrow</span>
                </button>
                <div className="flex-1">
                  <div className="flex gap-1 items-center h-12">
                    {[...Array(30)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary/60 rounded-full"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm font-mono text-slate-400">45:12</span>
              </div>
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">replay_10</span>
                  <span className="text-sm">-10s</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <span className="text-sm">+10s</span>
                  <span className="material-symbols-outlined">forward_10</span>
                </button>
              </div>
            </div>
            {note.content && (
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Transcript</h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{note.content}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full min-h-[400px] bg-surface-dark border border-slate-700 rounded-2xl p-4 text-slate-300 leading-relaxed focus:outline-none focus:border-primary resize-none"
                placeholder="Write your note content..."
              />
            ) : (
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-base">{note.content || 'No content yet. Click edit to add content.'}</p>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-surface-dark rounded-3xl p-8 w-full max-w-md border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-center size-16 rounded-full bg-red-900/30 mx-auto mb-6">
              <span className="material-symbols-outlined text-red-500 text-3xl">delete</span>
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">Delete Note?</h2>
            <p className="text-slate-400 text-center mb-6">
              Are you sure you want to delete "{note.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close more menu */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMoreMenu(false)}
        />
      )}
    </div>
  );
};

export default NoteDetailView;
