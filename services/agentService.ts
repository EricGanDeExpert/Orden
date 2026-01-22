// Agent service for interacting with the notes management agent

const API_URL = 'http://localhost:3001';

interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
  actions?: string[];
  error?: string;
}

interface AgentStatus {
  status: 'ready' | 'not_configured';
  message: string;
}

// Get authentication token
const getToken = (): string | null => {
  return localStorage.getItem('orden_token');
};

// Check agent status
export const getAgentStatus = async (): Promise<AgentStatus> => {
  try {
    const response = await fetch(`${API_URL}/api/agent/status`);
    if (!response.ok) {
      throw new Error('Failed to check agent status');
    }
    return response.json();
  } catch (error) {
    return {
      status: 'not_configured',
      message: 'Unable to connect to agent service',
    };
  }
};

// Send command to agent
export const sendAgentCommand = async (
  command: string,
  conversationHistory: AgentMessage[] = []
): Promise<AgentResponse> => {
  const token = getToken();

  if (!token) {
    return {
      success: false,
      message: 'Authentication required. Please log in.',
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/agent/command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        command,
        conversationHistory,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'Failed to process command',
      };
    }

    return response.json();
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${(error as Error).message}`,
    };
  }
};

// Helper function to format agent response for display
export const formatAgentResponse = (response: AgentResponse): string => {
  if (!response.success) {
    return `Error: ${response.message}`;
  }

  let output = response.message;

  // If there are actions, optionally show them (for debugging)
  if (response.actions && response.actions.length > 0 && process.env.NODE_ENV === 'development') {
    output += '\n\n---\nActions taken:\n';
    output += response.actions.map(a => `- ${a}`).join('\n');
  }

  return output;
};

// Example commands for users
export const EXAMPLE_COMMANDS = [
  'List all my folders',
  'Search for notes about photosynthesis',
  'Create a new note about JavaScript basics in the biology folder',
  'Show me notes in the history folder',
  'Update the cell structure note with more information',
  'Create a study checklist for my biology exam',
  'Look up information about mitochondria and add it to my notes',
  'Delete the temporary note I created',
  'Create a new folder called chemistry',
];
