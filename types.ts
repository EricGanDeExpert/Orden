
export enum View {
  CHAT = 'chat',
  NOTES = 'notes',
  PROFILE = 'profile',
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachment?: {
    type: 'canvas' | 'image' | 'audio';
    title: string;
    subtitle: string;
  };
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  active?: boolean;
}

export interface Note {
  id: string;
  type: 'summary' | 'slides' | 'audio' | 'article' | 'tasks';
  title: string;
  subtitle: string;
  content?: string;
  date: string;
  tags?: string[];
  image?: string;
  progress?: { completed: number; total: number; items: { label: string; done: boolean }[] };
}
