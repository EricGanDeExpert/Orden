import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import db from '../database';
import { ToolDefinition, FolderInfo, NoteInfo, SearchResult, WebSearchResult } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to public/data folder
const DATA_PATH = join(__dirname, '..', '..', 'public', 'data');

// Folder configuration (matches notesService.ts)
const FOLDERS_CONFIG: Record<string, { name: string; icon: string }> = {
  biology: { name: 'Biology 101', icon: 'biotech' },
  history: { name: 'World History', icon: 'history_edu' },
};

// Tool definitions for Claude API
export const AGENT_TOOLS: ToolDefinition[] = [
  {
    name: 'list_folders',
    description: 'List all available folders that contain notes. Use this to understand what folders exist before creating or searching for notes.',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'list_notes',
    description: 'List all notes in a specific folder. Returns note IDs, titles, types, and previews. Use this to find existing notes before creating new ones.',
    input_schema: {
      type: 'object',
      properties: {
        folderId: {
          type: 'string',
          description: 'The ID of the folder to list notes from (e.g., "biology", "history")',
        },
      },
      required: ['folderId'],
    },
  },
  {
    name: 'search_notes',
    description: 'Search for notes across all folders by title or content. Use this to find existing notes that might match what the user is looking for.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query to find notes (searches in titles and content)',
        },
        folderId: {
          type: 'string',
          description: 'Optional: limit search to a specific folder',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'read_note',
    description: 'Read the full content of a specific note. Use this to get complete details of a note.',
    input_schema: {
      type: 'object',
      properties: {
        noteId: {
          type: 'string',
          description: 'The ID of the note to read',
        },
        folderId: {
          type: 'string',
          description: 'The ID of the folder containing the note',
        },
      },
      required: ['noteId', 'folderId'],
    },
  },
  {
    name: 'create_note',
    description: 'Create a new note in a folder. Only use this after confirming the note does not already exist using search_notes or list_notes.',
    input_schema: {
      type: 'object',
      properties: {
        folderId: {
          type: 'string',
          description: 'The ID of the folder to create the note in',
        },
        title: {
          type: 'string',
          description: 'The title of the new note',
        },
        content: {
          type: 'string',
          description: 'The markdown content of the note',
        },
        type: {
          type: 'string',
          enum: ['summary', 'slides', 'article', 'tasks', 'audio'],
          description: 'The type of note (default: summary)',
        },
        subtitle: {
          type: 'string',
          description: 'Optional subtitle or description for the note',
        },
      },
      required: ['folderId', 'title', 'content'],
    },
  },
  {
    name: 'update_note',
    description: 'Update an existing note with new content. Use this to modify notes rather than creating duplicates.',
    input_schema: {
      type: 'object',
      properties: {
        noteId: {
          type: 'string',
          description: 'The ID of the note to update',
        },
        folderId: {
          type: 'string',
          description: 'The ID of the folder containing the note',
        },
        title: {
          type: 'string',
          description: 'New title for the note (optional)',
        },
        content: {
          type: 'string',
          description: 'New markdown content for the note (optional)',
        },
        subtitle: {
          type: 'string',
          description: 'New subtitle for the note (optional)',
        },
      },
      required: ['noteId', 'folderId'],
    },
  },
  {
    name: 'delete_note',
    description: 'Delete a note from a folder. Use with caution.',
    input_schema: {
      type: 'object',
      properties: {
        noteId: {
          type: 'string',
          description: 'The ID of the note to delete',
        },
        folderId: {
          type: 'string',
          description: 'The ID of the folder containing the note',
        },
      },
      required: ['noteId', 'folderId'],
    },
  },
  {
    name: 'create_folder',
    description: 'Create a new folder for organizing notes. Only use this after confirming the folder does not already exist using list_folders.',
    input_schema: {
      type: 'object',
      properties: {
        folderId: {
          type: 'string',
          description: 'A unique ID for the folder (lowercase, no spaces, e.g., "chemistry")',
        },
        name: {
          type: 'string',
          description: 'Display name for the folder (e.g., "Chemistry 101")',
        },
        icon: {
          type: 'string',
          description: 'Material icon name for the folder (e.g., "science", "book", "calculate")',
        },
      },
      required: ['folderId', 'name'],
    },
  },
  {
    name: 'web_search',
    description: 'Search the web for information to add to notes. Use this when you need current information or facts to include in note content.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query to look up information',
        },
      },
      required: ['query'],
    },
  },
];

// Tool implementations
export class AgentToolExecutor {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async executeTool(toolName: string, input: Record<string, any>): Promise<string> {
    try {
      switch (toolName) {
        case 'list_folders':
          return this.listFolders();
        case 'list_notes':
          return this.listNotes(input.folderId);
        case 'search_notes':
          return this.searchNotes(input.query, input.folderId);
        case 'read_note':
          return this.readNote(input.noteId, input.folderId);
        case 'create_note':
          return this.createNote(input.folderId, input.title, input.content, input.type, input.subtitle);
        case 'update_note':
          return this.updateNote(input.noteId, input.folderId, input.title, input.content, input.subtitle);
        case 'delete_note':
          return this.deleteNote(input.noteId, input.folderId);
        case 'create_folder':
          return this.createFolder(input.folderId, input.name, input.icon);
        case 'web_search':
          return await this.webSearch(input.query);
        default:
          return JSON.stringify({ error: `Unknown tool: ${toolName}` });
      }
    } catch (error) {
      return JSON.stringify({ error: `Tool execution failed: ${(error as Error).message}` });
    }
  }

  private listFolders(): string {
    const folders: FolderInfo[] = [];

    // Get configured folders
    for (const [id, config] of Object.entries(FOLDERS_CONFIG)) {
      const folderPath = join(DATA_PATH, id);
      let noteCount = 0;

      if (existsSync(folderPath)) {
        const files = readdirSync(folderPath).filter(f => f.endsWith('.md'));
        noteCount = files.length;
      }

      // Add custom notes count
      const customNotesStmt = db.prepare('SELECT COUNT(*) as count FROM custom_notes WHERE user_id = ? AND folder_id = ?');
      const customCount = (customNotesStmt.get(this.userId, id) as any)?.count || 0;

      folders.push({
        id,
        name: config.name,
        icon: config.icon,
        noteCount: noteCount + customCount,
      });
    }

    // Check for any additional folders in the data directory
    if (existsSync(DATA_PATH)) {
      const dirs = readdirSync(DATA_PATH, { withFileTypes: true })
        .filter(d => d.isDirectory() && !FOLDERS_CONFIG[d.name]);

      for (const dir of dirs) {
        const folderPath = join(DATA_PATH, dir.name);
        const files = readdirSync(folderPath).filter(f => f.endsWith('.md'));

        folders.push({
          id: dir.name,
          name: dir.name.charAt(0).toUpperCase() + dir.name.slice(1),
          icon: 'folder',
          noteCount: files.length,
        });
      }
    }

    return JSON.stringify({ folders });
  }

  private listNotes(folderId: string): string {
    const notes: NoteInfo[] = [];
    const folderPath = join(DATA_PATH, folderId);

    // Get static markdown notes
    if (existsSync(folderPath)) {
      const files = readdirSync(folderPath).filter(f => f.endsWith('.md'));

      for (const file of files) {
        const filePath = join(folderPath, file);
        const content = readFileSync(filePath, 'utf-8');
        const noteId = file.replace('.md', '');

        // Extract title from first heading or filename
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : noteId;

        // Get first 200 chars for preview
        const preview = content.replace(/^#.+$/m, '').trim().substring(0, 200);

        // Check if user has edits
        const editStmt = db.prepare('SELECT title, content, subtitle FROM note_edits WHERE user_id = ? AND note_id = ?');
        const edit = editStmt.get(this.userId, noteId) as any;

        notes.push({
          id: noteId,
          folderId,
          type: this.inferNoteType(content),
          title: edit?.title || title,
          subtitle: edit?.subtitle || preview.substring(0, 50),
          content: edit?.content || content,
          date: 'static',
          isCustom: false,
        });
      }
    }

    // Get custom notes from database
    const customStmt = db.prepare(`
      SELECT id, folder_id as folderId, type, title, subtitle, content, date
      FROM custom_notes WHERE user_id = ? AND folder_id = ?
    `);
    const customNotes = customStmt.all(this.userId, folderId) as any[];

    for (const note of customNotes) {
      notes.push({
        ...note,
        isCustom: true,
      });
    }

    return JSON.stringify({ notes, count: notes.length });
  }

  private searchNotes(query: string, folderId?: string): string {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Determine which folders to search
    const foldersToSearch = folderId
      ? [folderId]
      : Object.keys(FOLDERS_CONFIG);

    for (const folder of foldersToSearch) {
      const folderPath = join(DATA_PATH, folder);

      if (existsSync(folderPath)) {
        const files = readdirSync(folderPath).filter(f => f.endsWith('.md'));

        for (const file of files) {
          const filePath = join(folderPath, file);
          const content = readFileSync(filePath, 'utf-8');
          const noteId = file.replace('.md', '');

          const titleMatch = content.match(/^#\s+(.+)$/m);
          const title = titleMatch ? titleMatch[1] : noteId;

          // Check title match
          if (title.toLowerCase().includes(lowerQuery)) {
            results.push({
              noteId,
              folderId: folder,
              title,
              matchType: 'title',
              snippet: content.substring(0, 150),
            });
          }
          // Check content match
          else if (content.toLowerCase().includes(lowerQuery)) {
            const idx = content.toLowerCase().indexOf(lowerQuery);
            const start = Math.max(0, idx - 50);
            const end = Math.min(content.length, idx + 100);

            results.push({
              noteId,
              folderId: folder,
              title,
              matchType: 'content',
              snippet: '...' + content.substring(start, end) + '...',
            });
          }
        }
      }
    }

    // Search custom notes
    let customQuery = `
      SELECT id, folder_id as folderId, title, content
      FROM custom_notes
      WHERE user_id = ? AND (title LIKE ? OR content LIKE ?)
    `;
    const params: any[] = [this.userId, `%${query}%`, `%${query}%`];

    if (folderId) {
      customQuery += ' AND folder_id = ?';
      params.push(folderId);
    }

    const customStmt = db.prepare(customQuery);
    const customNotes = customStmt.all(...params) as any[];

    for (const note of customNotes) {
      results.push({
        noteId: note.id,
        folderId: note.folderId,
        title: note.title,
        matchType: note.title.toLowerCase().includes(lowerQuery) ? 'title' : 'content',
        snippet: note.content?.substring(0, 150) || '',
      });
    }

    return JSON.stringify({ results, count: results.length });
  }

  private readNote(noteId: string, folderId: string): string {
    // Check custom notes first
    const customStmt = db.prepare(`
      SELECT id, folder_id as folderId, type, title, subtitle, content, date
      FROM custom_notes WHERE user_id = ? AND id = ?
    `);
    const customNote = customStmt.get(this.userId, noteId) as any;

    if (customNote) {
      return JSON.stringify({ note: { ...customNote, isCustom: true } });
    }

    // Check static notes
    const folderPath = join(DATA_PATH, folderId);
    const filePath = join(folderPath, `${noteId}.md`);

    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : noteId;

      // Check for user edits
      const editStmt = db.prepare('SELECT title, content, subtitle FROM note_edits WHERE user_id = ? AND note_id = ?');
      const edit = editStmt.get(this.userId, noteId) as any;

      return JSON.stringify({
        note: {
          id: noteId,
          folderId,
          type: this.inferNoteType(content),
          title: edit?.title || title,
          subtitle: edit?.subtitle || '',
          content: edit?.content || content,
          date: 'static',
          isCustom: false,
        },
      });
    }

    return JSON.stringify({ error: 'Note not found' });
  }

  private createNote(folderId: string, title: string, content: string, type?: string, subtitle?: string): string {
    // Create as custom note in database
    const id = randomUUID();
    const noteType = type || 'summary';
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const stmt = db.prepare(`
      INSERT INTO custom_notes (id, user_id, folder_id, type, title, subtitle, content, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, this.userId, folderId, noteType, title, subtitle || '', content, date);

    return JSON.stringify({
      success: true,
      message: `Note "${title}" created successfully in folder "${folderId}"`,
      note: {
        id,
        folderId,
        type: noteType,
        title,
        subtitle: subtitle || '',
        content,
        date,
        isCustom: true,
      },
    });
  }

  private updateNote(noteId: string, folderId: string, title?: string, content?: string, subtitle?: string): string {
    // Check if it's a custom note
    const customStmt = db.prepare('SELECT id FROM custom_notes WHERE user_id = ? AND id = ?');
    const customNote = customStmt.get(this.userId, noteId);

    if (customNote) {
      // Update custom note
      const updates: string[] = [];
      const params: any[] = [];

      if (title !== undefined) {
        updates.push('title = ?');
        params.push(title);
      }
      if (content !== undefined) {
        updates.push('content = ?');
        params.push(content);
      }
      if (subtitle !== undefined) {
        updates.push('subtitle = ?');
        params.push(subtitle);
      }

      if (updates.length > 0) {
        params.push(this.userId, noteId);
        const updateStmt = db.prepare(`UPDATE custom_notes SET ${updates.join(', ')} WHERE user_id = ? AND id = ?`);
        updateStmt.run(...params);
      }

      return JSON.stringify({
        success: true,
        message: `Custom note "${noteId}" updated successfully`,
      });
    }

    // Update static note via edits table
    const existing = db.prepare('SELECT id FROM note_edits WHERE user_id = ? AND note_id = ?').get(this.userId, noteId);

    if (existing) {
      const updates: string[] = [];
      const params: any[] = [];

      if (title !== undefined) {
        updates.push('title = ?');
        params.push(title);
      }
      if (content !== undefined) {
        updates.push('content = ?');
        params.push(content);
      }
      if (subtitle !== undefined) {
        updates.push('subtitle = ?');
        params.push(subtitle);
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(this.userId, noteId);

      const updateStmt = db.prepare(`UPDATE note_edits SET ${updates.join(', ')} WHERE user_id = ? AND note_id = ?`);
      updateStmt.run(...params);
    } else {
      const id = randomUUID();
      const insertStmt = db.prepare(`
        INSERT INTO note_edits (id, user_id, note_id, folder_id, title, content, subtitle)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      insertStmt.run(id, this.userId, noteId, folderId, title || null, content || null, subtitle || null);
    }

    return JSON.stringify({
      success: true,
      message: `Note "${noteId}" updated successfully`,
    });
  }

  private deleteNote(noteId: string, folderId: string): string {
    // Check if it's a custom note
    const customStmt = db.prepare('DELETE FROM custom_notes WHERE user_id = ? AND id = ?');
    const result = customStmt.run(this.userId, noteId);

    if (result.changes > 0) {
      return JSON.stringify({
        success: true,
        message: `Custom note "${noteId}" deleted successfully`,
      });
    }

    // For static notes, we can only delete the edits
    const editStmt = db.prepare('DELETE FROM note_edits WHERE user_id = ? AND note_id = ?');
    editStmt.run(this.userId, noteId);

    return JSON.stringify({
      success: true,
      message: `Note edits for "${noteId}" cleared. Static notes cannot be fully deleted.`,
    });
  }

  private createFolder(folderId: string, name: string, icon?: string): string {
    const folderPath = join(DATA_PATH, folderId);

    if (existsSync(folderPath)) {
      return JSON.stringify({
        success: false,
        message: `Folder "${folderId}" already exists`,
      });
    }

    // Create folder directory
    mkdirSync(folderPath, { recursive: true });

    // Note: The folder config would need to be stored in database for persistence
    // For now, we'll create the directory and it will appear with default settings

    return JSON.stringify({
      success: true,
      message: `Folder "${name}" (${folderId}) created successfully`,
      folder: {
        id: folderId,
        name,
        icon: icon || 'folder',
        noteCount: 0,
      },
    });
  }

  private async webSearch(query: string): Promise<string> {
    // Use a simple web search API (DuckDuckGo Instant Answer API)
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_html=1&skip_disambig=1`);

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();
      const results: WebSearchResult[] = [];

      // Extract abstract/summary
      if (data.Abstract) {
        results.push({
          title: data.Heading || query,
          url: data.AbstractURL || '',
          snippet: data.Abstract,
        });
      }

      // Extract related topics
      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics.slice(0, 5)) {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(' - ')[0] || 'Related',
              url: topic.FirstURL,
              snippet: topic.Text,
            });
          }
        }
      }

      // If no results, provide a helpful message
      if (results.length === 0) {
        return JSON.stringify({
          results: [],
          message: `No instant results found for "${query}". Consider refining your search query or using more specific terms.`,
        });
      }

      return JSON.stringify({ results, count: results.length });
    } catch (error) {
      return JSON.stringify({
        error: `Web search failed: ${(error as Error).message}`,
        suggestion: 'Try a different search query or check network connectivity',
      });
    }
  }

  private inferNoteType(content: string): string {
    // Check for task list
    if (/^[-*]\s+\[[x\s]\]/m.test(content)) {
      return 'tasks';
    }
    // Check for slides (multiple h2 sections)
    if ((content.match(/^##\s+/gm) || []).length >= 3) {
      return 'slides';
    }
    // Default to summary
    return 'summary';
  }
}
