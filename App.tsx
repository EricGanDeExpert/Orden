import React, { useState, useEffect } from 'react';
import { View, User, Note } from './types';
import Layout from './components/Layout';
import ChatView from './views/ChatView';
import FolderView from './views/FolderView';
import ProfileView from './views/ProfileView';
import LoginView from './views/LoginView';
import SignupView from './views/SignupView';
import GeneralSettingsView from './views/GeneralSettingsView';
import NoteDetailView from './views/NoteDetailView';
import * as authService from './services/authService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('biology');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [customNotes, setCustomNotes] = useState<Record<string, Note[]>>({});

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const response = await authService.getCurrentUser();
        if (response.success && response.user) {
          setUser(response.user);
          setActiveView(View.CHAT);
        }
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(undefined);

    const response = await authService.login(email, password);

    if (response.success && response.user) {
      setUser(response.user);
      setActiveView(View.CHAT);
    } else {
      setAuthError(response.error);
    }

    setIsLoading(false);
  };

  const handleSignup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    setAuthError(undefined);

    const response = await authService.signup(email, password, username);

    if (response.success && response.user) {
      setUser(response.user);
      setActiveView(View.CHAT);
    } else {
      setAuthError(response.error);
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setActiveView(View.LOGIN);
  };

  const handleAvatarChange = async (avatarUrl: string) => {
    const response = await authService.updateAvatar(avatarUrl);
    if (response.success && response.user) {
      setUser(response.user);
    }
  };

  const handleUpdateUsername = async (newUsername: string) => {
    const response = await authService.updateUsername(newUsername);
    if (response.success && response.user) {
      setUser(response.user);
    }
    return { success: response.success, error: response.error };
  };

  const handleUpdatePassword = async (currentPassword: string, newPassword: string) => {
    const response = await authService.updatePassword(currentPassword, newPassword);
    return { success: response.success, error: response.error };
  };

  // Handle folder selection and navigate to notes
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
    setActiveView(View.NOTES);
  };

  // Handle note selection and navigate to note detail
  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setActiveView(View.NOTE_DETAIL);
  };

  // Handle adding a new note
  const handleAddNote = (note: Note) => {
    setCustomNotes(prev => ({
      ...prev,
      [selectedFolderId]: [...(prev[selectedFolderId] || []), note]
    }));
  };

  // Handle updating a note
  const handleUpdateNote = (updatedNote: Note) => {
    setSelectedNote(updatedNote);
    // Update in custom notes if it exists there
    setCustomNotes(prev => {
      const folderNotes = prev[selectedFolderId] || [];
      const noteIndex = folderNotes.findIndex(n => n.id === updatedNote.id);
      if (noteIndex !== -1) {
        const newNotes = [...folderNotes];
        newNotes[noteIndex] = updatedNote;
        return { ...prev, [selectedFolderId]: newNotes };
      }
      return prev;
    });
  };

  // Handle deleting a note
  const handleDeleteNote = (noteId: string) => {
    setCustomNotes(prev => ({
      ...prev,
      [selectedFolderId]: (prev[selectedFolderId] || []).filter(n => n.id !== noteId)
    }));
  };

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center bg-black min-h-screen">
        <div className="relative w-full max-w-4xl bg-background-dark overflow-hidden flex flex-col h-screen md:rounded-[40px] md:my-8 md:shadow-2xl md:border-[12px] border-slate-900">
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
              <p className="text-slate-400 font-medium">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Auth views (no bottom nav)
  if (activeView === View.LOGIN) {
    return (
      <div className="flex justify-center bg-black min-h-screen">
        <div className="relative w-full max-w-4xl bg-background-dark overflow-hidden flex flex-col h-screen md:rounded-[40px] md:my-8 md:shadow-2xl md:border-[12px] border-slate-900">
          <LoginView
            onLogin={handleLogin}
            onSwitchToSignup={() => {
              setAuthError(undefined);
              setActiveView(View.SIGNUP);
            }}
            error={authError}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  if (activeView === View.SIGNUP) {
    return (
      <div className="flex justify-center bg-black min-h-screen">
        <div className="relative w-full max-w-4xl bg-background-dark overflow-hidden flex flex-col h-screen md:rounded-[40px] md:my-8 md:shadow-2xl md:border-[12px] border-slate-900">
          <SignupView
            onSignup={handleSignup}
            onSwitchToLogin={() => {
              setAuthError(undefined);
              setActiveView(View.LOGIN);
            }}
            error={authError}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  // General Settings view (no bottom nav, has back button)
  if (activeView === View.GENERAL_SETTINGS && user) {
    return (
      <div className="flex justify-center bg-black min-h-screen">
        <div className="relative w-full max-w-4xl bg-background-dark overflow-hidden flex flex-col h-screen md:rounded-[40px] md:my-8 md:shadow-2xl md:border-[12px] border-slate-900">
          <GeneralSettingsView
            user={user}
            onBack={() => setActiveView(View.PROFILE)}
            onUpdateUsername={handleUpdateUsername}
            onUpdatePassword={handleUpdatePassword}
          />
        </div>
      </div>
    );
  }

  // Note Detail view (no bottom nav, has back button)
  if (activeView === View.NOTE_DETAIL && selectedNote) {
    return (
      <div className="flex justify-center bg-black min-h-screen">
        <div className="relative w-full max-w-4xl bg-background-dark overflow-hidden flex flex-col h-screen md:rounded-[40px] md:my-8 md:shadow-2xl md:border-[12px] border-slate-900">
          <NoteDetailView
            note={selectedNote}
            onBack={() => setActiveView(View.NOTES)}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        </div>
      </div>
    );
  }

  // Main app views (with bottom nav)
  const renderView = () => {
    switch (activeView) {
      case View.CHAT:
        return <ChatView selectedFolderId={selectedFolderId} onFolderSelect={handleFolderSelect} />;
      case View.NOTES:
        return (
          <FolderView
            folderId={selectedFolderId}
            onBack={() => setActiveView(View.CHAT)}
            onNoteSelect={handleNoteSelect}
            onAddNote={handleAddNote}
          />
        );
      case View.PROFILE:
        if (user) {
          return (
            <ProfileView
              user={user}
              onLogout={handleLogout}
              onAvatarChange={handleAvatarChange}
              onGeneralSettings={() => setActiveView(View.GENERAL_SETTINGS)}
            />
          );
        }
        return <ChatView selectedFolderId={selectedFolderId} onFolderSelect={handleFolderSelect} />;
      default:
        return <ChatView selectedFolderId={selectedFolderId} onFolderSelect={handleFolderSelect} />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </Layout>
  );
};

export default App;
