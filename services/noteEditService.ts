import { Note } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Cache for note edits (sync with server)
let editsCache: Record<string, Note> | null = null;

// Fetch all note edits from server
const fetchEditsFromServer = async (): Promise<Record<string, Note>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/edits`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error('Failed to fetch edits from server');
      return {};
    }

    const data = await response.json();
    const editsMap: Record<string, Note> = {};

    // Convert server edits to Note format
    data.edits.forEach((edit: any) => {
      editsMap[edit.noteId] = {
        id: edit.noteId,
        type: 'article', // Default type, will be overridden
        title: edit.title,
        subtitle: edit.subtitle,
        content: edit.content,
        date: edit.updatedAt,
      } as Note;
    });

    editsCache = editsMap;
    return editsMap;
  } catch (error) {
    console.error('Error fetching edits:', error);
    return {};
  }
};

// Get all note edits (with cache)
const getEditedNotes = async (): Promise<Record<string, Note>> => {
  if (editsCache) {
    return editsCache;
  }
  return await fetchEditsFromServer();
};

// Save a note edit to server
export const saveNoteEdit = async (note: Note): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/edits`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        noteId: note.id,
        folderId: note.id.startsWith('bio-') ? 'biology' : 'history', // Infer from ID
        title: note.title,
        content: note.content,
        subtitle: note.subtitle,
      }),
    });

    if (!response.ok) {
      console.error('Failed to save note edit to server');
      return;
    }

    // Update cache
    if (editsCache) {
      editsCache[note.id] = note;
    }
  } catch (error) {
    console.error('Error saving note edit:', error);
  }
};

// Get an edited note by ID
export const getEditedNote = async (noteId: string): Promise<Note | undefined> => {
  const edits = await getEditedNotes();
  return edits[noteId];
};

// Apply edits to a list of notes
export const applyEditsToNotes = async (notes: Note[]): Promise<Note[]> => {
  const edits = await getEditedNotes();
  return notes.map(note => {
    const edit = edits[note.id];
    if (edit) {
      // Merge edited fields with original note
      return {
        ...note,
        ...edit,
        // Keep original metadata that shouldn't be edited
        type: note.type,
        tags: note.tags,
        image: note.image,
        progress: note.progress,
      };
    }
    return note;
  });
};

// Delete a note edit
export const deleteNoteEdit = async (noteId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/edits/${noteId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error('Failed to delete note edit from server');
      return;
    }

    // Update cache
    if (editsCache) {
      delete editsCache[noteId];
    }
  } catch (error) {
    console.error('Error deleting note edit:', error);
  }
};

// Clear all edits (invalidate cache)
export const clearAllEdits = (): void => {
  editsCache = null;
};
