// Agent types and interfaces

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface ToolUse {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, any>;
}

export interface ToolResult {
  type: 'tool_result';
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

export interface AgentRequest {
  command: string;
  userId: string;
  conversationHistory?: AgentMessage[];
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
  actions?: string[];
}

export interface FolderInfo {
  id: string;
  name: string;
  icon: string;
  noteCount: number;
}

export interface NoteInfo {
  id: string;
  folderId: string;
  type: string;
  title: string;
  subtitle: string;
  content: string;
  date: string;
  isCustom: boolean;
}

export interface SearchResult {
  noteId: string;
  folderId: string;
  title: string;
  matchType: 'title' | 'content';
  snippet: string;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}
