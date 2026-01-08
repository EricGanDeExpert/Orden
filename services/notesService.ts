import { Note, Folder } from '../types';
import { applyEditsToNotes } from './noteEditService';

// Define folders with their associated data directories
export const FOLDERS: Folder[] = [
  { id: 'biology', name: 'Biology 101', icon: 'biotech' },
  { id: 'history', name: 'World History', icon: 'history_edu' },
];

// Mapping of markdown filenames to note IDs and metadata
const MARKDOWN_FILES: Record<string, Array<{
  id: string;
  file: string;
  type: Note['type'];
  title: string;
  subtitle: string;
  date: string;
  tags?: string[];
  image?: string;
  hasTaskList?: boolean;
}>> = {
  biology: [
    {
      id: 'bio-1',
      file: '/data/biology/cell-structure-organelles.md',
      type: 'summary',
      title: 'Cell Structure and Organelles',
      subtitle: 'Comprehensive notes on cell biology',
      date: '2h ago',
      tags: ['#cells', '#organelles'],
    },
    {
      id: 'bio-2',
      file: '/data/biology/photosynthesis-diagrams.md',
      type: 'slides',
      title: 'Photosynthesis Diagrams',
      subtitle: 'Visual guide with chloroplast structure',
      date: 'Yesterday',
      tags: ['#photosynthesis', '#diagrams'],
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Chloroplast_II.svg/800px-Chloroplast_II.svg.png',
    },
    {
      id: 'bio-3',
      file: '/data/biology/genetics-study-plan.md',
      type: 'tasks',
      title: 'Genetics Study Plan',
      subtitle: '0/30 Completed',
      date: 'Oct 24',
      hasTaskList: true,
    },
    {
      id: 'bio-4',
      file: '/data/biology/evolution-natural-selection.md',
      type: 'article',
      title: 'Evolution and Natural Selection',
      subtitle: 'Darwin\'s theory explained',
      date: 'Oct 22',
      tags: ['#evolution', '#darwin'],
    },
    {
      id: 'bio-5',
      file: '/data/biology/ecosystems-ecology.md',
      type: 'summary',
      title: 'Ecosystems and Ecology',
      subtitle: 'Study notes on ecological systems',
      date: 'Oct 20',
      tags: ['#ecology', '#ecosystems'],
    },
  ],
  history: [
    {
      id: 'hist-1',
      file: '/data/history/ancient-rome.md',
      type: 'article',
      title: 'Ancient Rome: Republic to Empire',
      subtitle: 'Comprehensive overview',
      date: '3h ago',
      tags: ['#rome', '#ancient'],
    },
    {
      id: 'hist-2',
      file: '/data/history/world-war-ii.md',
      type: 'slides',
      title: 'World War II Visual History',
      subtitle: 'Key events with historical photos',
      date: 'Yesterday',
      tags: ['#ww2', '#photos'],
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Into_the_Jaws_of_Death_23-0455M_edit.jpg/800px-Into_the_Jaws_of_Death_23-0455M_edit.jpg',
    },
    {
      id: 'hist-3',
      file: '/data/history/industrial-revolution-research.md',
      type: 'tasks',
      title: 'Industrial Revolution Research',
      subtitle: '0/52 Completed',
      date: 'Oct 24',
      hasTaskList: true,
    },
    {
      id: 'hist-4',
      file: '/data/history/french-revolution.md',
      type: 'article',
      title: 'The French Revolution',
      subtitle: '1789-1799 detailed analysis',
      date: 'Oct 22',
      tags: ['#france', '#revolution'],
    },
    {
      id: 'hist-5',
      file: '/data/history/civil-rights-movement.md',
      type: 'article',
      title: 'Civil Rights Movement',
      subtitle: 'American history study notes',
      date: 'Oct 20',
      tags: ['#civilrights', '#america'],
    },
  ],
};

// Cache for loaded markdown content
const contentCache: Record<string, string> = {};
const notesCache: Record<string, Note[]> = {};

// Function to load markdown content
const loadMarkdownContent = async (filePath: string): Promise<string> => {
  if (contentCache[filePath]) {
    return contentCache[filePath];
  }

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}`);
    }
    const content = await response.text();
    contentCache[filePath] = content;
    return content;
  } catch (error) {
    console.error('Error loading markdown:', error);
    return '';
  }
};

// Function to extract task list items from markdown content
const extractTaskList = (content: string): { label: string; done: boolean }[] => {
  const taskRegex = /^[-*]\s+\[([x\s])\]\s+(.+)$/gm;
  const tasks: { label: string; done: boolean }[] = [];
  let match: RegExpExecArray | null;

  while ((match = taskRegex.exec(content)) !== null) {
    tasks.push({
      done: match[1].toLowerCase() === 'x',
      label: match[2].trim(),
    });
  }

  return tasks;
};

// Extract clean preview text from markdown content
const extractPreviewText = (content: string, maxLength: number = 200): string => {
  // Remove markdown headers (# ## ###)
  let preview = content.replace(/^#+\s+.+$/gm, '');
  // Remove metadata lines (Tags:, Date:, etc.)
  preview = preview.replace(/\*\*[^*]+:\*\*.+$/gm, '');
  // Remove task list items
  preview = preview.replace(/^[-*]\s+\[[x\s]\]\s+.+$/gm, '');
  // Remove images
  preview = preview.replace(/!\[.*?\]\(.*?\)/g, '');
  // Remove links but keep text
  preview = preview.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // Remove code blocks
  preview = preview.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  preview = preview.replace(/`[^`]+`/g, '');
  // Remove bold/italic markers
  preview = preview.replace(/\*\*([^*]+)\*\*/g, '$1');
  preview = preview.replace(/\*([^*]+)\*/g, '$1');
  // Remove extra whitespace and newlines
  preview = preview.replace(/\n\n+/g, ' ').trim();

  // Get first paragraph or first maxLength characters
  if (preview.length > maxLength) {
    return preview.substring(0, maxLength).trim() + '...';
  }
  return preview || 'Click to view note content';
};

// Load notes for a folder
const loadNotesForFolder = async (folderId: string): Promise<Note[]> => {
  if (notesCache[folderId]) {
    return notesCache[folderId];
  }

  const fileMetadata = MARKDOWN_FILES[folderId] || [];
  const notes: Note[] = [];

  for (const meta of fileMetadata) {
    const content = await loadMarkdownContent(meta.file);

    // Extract clean preview text (not full content for preview)
    const previewText = extractPreviewText(content);

    let note: Note = {
      id: meta.id,
      type: meta.type,
      title: meta.title,
      subtitle: meta.subtitle,
      content: content, // Store full markdown content
      preview: previewText, // Clean preview for folder view
      date: meta.date,
      tags: meta.tags,
      image: meta.image,
    };

    // For task notes, extract and parse the checklist
    if (meta.hasTaskList && content) {
      const tasks = extractTaskList(content);
      const completedCount = tasks.filter(t => t.done).length;

      note.progress = {
        completed: completedCount,
        total: tasks.length,
        items: tasks.slice(0, 5), // Show first 5 in preview
      };

      // Update subtitle with progress
      note.subtitle = `${completedCount}/${tasks.length} Completed`;
    }

    notes.push(note);
  }

  notesCache[folderId] = notes;
  return notes;
};

// Get all folders
export const getFolders = (): Folder[] => {
  return FOLDERS;
};

// Get notes for a specific folder
export const getNotesByFolder = async (folderId: string): Promise<Note[]> => {
  const notes = await loadNotesForFolder(folderId);
  // Apply any user edits from localStorage
  return applyEditsToNotes(notes);
};

// Get notes for a specific folder (synchronous - returns cached or empty)
export const getNotesByFolderSync = (folderId: string): Note[] => {
  return notesCache[folderId] || [];
};

// Get a single note by ID
export const getNoteById = async (noteId: string): Promise<Note | undefined> => {
  for (const folderId of Object.keys(MARKDOWN_FILES)) {
    const notes = await loadNotesForFolder(folderId);
    const note = notes.find(n => n.id === noteId);
    if (note) return note;
  }
  return undefined;
};

// Get folder by ID
export const getFolderById = (folderId: string): Folder | undefined => {
  return FOLDERS.find(f => f.id === folderId);
};

// Get note count for a folder
export const getNoteCount = (folderId: string): number => {
  const fileMetadata = MARKDOWN_FILES[folderId];
  return fileMetadata ? fileMetadata.length : 0;
};

// Preload notes for all folders (call on app init)
export const preloadAllNotes = async (): Promise<void> => {
  await Promise.all(
    Object.keys(MARKDOWN_FILES).map(folderId => loadNotesForFolder(folderId))
  );
};

// Clear the cache for a specific folder (call when notes are updated)
export const invalidateFolderCache = (folderId: string): void => {
  delete notesCache[folderId];
};
