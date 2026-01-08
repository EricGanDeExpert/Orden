import db from './database';
import { randomUUID } from 'crypto';

export interface NoteEdit {
  id: string;
  userId: string;
  noteId: string;
  folderId: string;
  title?: string;
  content?: string;
  subtitle?: string;
  updatedAt: string;
}

export interface CustomNote {
  id: string;
  userId: string;
  folderId: string;
  type: string;
  title: string;
  subtitle?: string;
  content?: string;
  date: string;
  createdAt: string;
}

// Get all note edits for a user
export const getUserNoteEdits = (userId: string): NoteEdit[] => {
  const stmt = db.prepare(`
    SELECT id, user_id as userId, note_id as noteId, folder_id as folderId,
           title, content, subtitle, updated_at as updatedAt
    FROM note_edits WHERE user_id = ?
  `);

  return stmt.all(userId) as NoteEdit[];
};

// Get a specific note edit
export const getNoteEdit = (userId: string, noteId: string): NoteEdit | undefined => {
  const stmt = db.prepare(`
    SELECT id, user_id as userId, note_id as noteId, folder_id as folderId,
           title, content, subtitle, updated_at as updatedAt
    FROM note_edits WHERE user_id = ? AND note_id = ?
  `);

  return stmt.get(userId, noteId) as NoteEdit | undefined;
};

// Save or update a note edit
export const saveNoteEdit = (
  userId: string,
  noteId: string,
  folderId: string,
  title?: string,
  content?: string,
  subtitle?: string
): NoteEdit => {
  const existing = getNoteEdit(userId, noteId);

  if (existing) {
    const stmt = db.prepare(`
      UPDATE note_edits
      SET title = ?, content = ?, subtitle = ?, folder_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND note_id = ?
    `);

    stmt.run(title || null, content || null, subtitle || null, folderId, userId, noteId);
  } else {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO note_edits (id, user_id, note_id, folder_id, title, content, subtitle)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, userId, noteId, folderId, title || null, content || null, subtitle || null);
  }

  return getNoteEdit(userId, noteId)!;
};

// Delete a note edit
export const deleteNoteEdit = (userId: string, noteId: string): boolean => {
  const stmt = db.prepare('DELETE FROM note_edits WHERE user_id = ? AND note_id = ?');
  const result = stmt.run(userId, noteId);
  return result.changes > 0;
};

// Get all custom notes for a user in a folder
export const getCustomNotes = (userId: string, folderId?: string): CustomNote[] => {
  let stmt;
  let params: any[];

  if (folderId) {
    stmt = db.prepare(`
      SELECT id, user_id as userId, folder_id as folderId, type, title, subtitle,
             content, date, created_at as createdAt
      FROM custom_notes WHERE user_id = ? AND folder_id = ?
    `);
    params = [userId, folderId];
  } else {
    stmt = db.prepare(`
      SELECT id, user_id as userId, folder_id as folderId, type, title, subtitle,
             content, date, created_at as createdAt
      FROM custom_notes WHERE user_id = ?
    `);
    params = [userId];
  }

  return stmt.all(...params) as CustomNote[];
};

// Create a custom note
export const createCustomNote = (
  userId: string,
  folderId: string,
  type: string,
  title: string,
  subtitle: string,
  content: string,
  date: string
): CustomNote => {
  const id = randomUUID();

  const stmt = db.prepare(`
    INSERT INTO custom_notes (id, user_id, folder_id, type, title, subtitle, content, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, userId, folderId, type, title, subtitle, content, date);

  const getStmt = db.prepare(`
    SELECT id, user_id as userId, folder_id as folderId, type, title, subtitle,
           content, date, created_at as createdAt
    FROM custom_notes WHERE id = ?
  `);

  return getStmt.get(id) as CustomNote;
};

// Delete a custom note
export const deleteCustomNote = (userId: string, noteId: string): boolean => {
  const stmt = db.prepare('DELETE FROM custom_notes WHERE user_id = ? AND id = ?');
  const result = stmt.run(userId, noteId);
  return result.changes > 0;
};
