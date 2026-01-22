import Anthropic from '@anthropic-ai/sdk';
import { AgentToolExecutor, AGENT_TOOLS } from './agentTools';
import { AgentRequest, AgentResponse, AgentMessage, ToolUse, ToolResult } from './types';

// Initialize Anthropic client
const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }
  return new Anthropic({ apiKey });
};

// System prompt for the notes management agent
const SYSTEM_PROMPT = `You are a helpful notes management agent that helps users organize, create, and manage their notes and folders.

Your primary responsibilities:
1. Help users find, create, update, and delete notes
2. Organize notes into appropriate folders
3. Search for information on the web when needed to enhance notes
4. Provide clear feedback about actions taken

IMPORTANT GUIDELINES:
- ALWAYS search for existing notes/folders FIRST before creating new ones
- Use list_folders to see available folders before creating a new folder
- Use search_notes or list_notes to find existing notes before creating duplicates
- When updating notes, preserve existing content unless explicitly asked to replace it
- When adding web-sourced information, cite the source
- Provide clear, concise feedback about what actions you took
- If a request is ambiguous, ask for clarification

WORKFLOW for note operations:
1. First, understand what the user wants
2. Search existing notes/folders to avoid duplicates
3. Perform the requested action (create, update, delete)
4. Provide a summary of what was done

When creating or updating notes:
- Use proper markdown formatting
- Include clear headings and structure
- For study notes, organize content logically
- For task lists, use markdown checkboxes: - [ ] task

Always respond in a helpful, professional manner and explain your actions clearly.`;

// Main agent function that processes user commands
export async function processAgentCommand(request: AgentRequest): Promise<AgentResponse> {
  const { command, userId, conversationHistory = [] } = request;
  const actions: string[] = [];

  try {
    const client = getClient();
    const toolExecutor = new AgentToolExecutor(userId);

    // Build messages array
    const messages: any[] = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add current user command
    messages.push({
      role: 'user',
      content: command,
    });

    // Agent loop - continue until no more tool calls
    let continueLoop = true;
    let finalResponse = '';
    let iterations = 0;
    const maxIterations = 10; // Safety limit

    while (continueLoop && iterations < maxIterations) {
      iterations++;

      // Call Claude API with tools
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: AGENT_TOOLS as any,
        messages,
      });

      // Process response content
      const toolUses: ToolUse[] = [];
      let textContent = '';

      for (const block of response.content) {
        if (block.type === 'text') {
          textContent += block.text;
        } else if (block.type === 'tool_use') {
          toolUses.push({
            type: 'tool_use',
            id: block.id,
            name: block.name,
            input: block.input as Record<string, any>,
          });
        }
      }

      // If there are tool calls, execute them
      if (toolUses.length > 0) {
        // Add assistant message with tool uses
        messages.push({
          role: 'assistant',
          content: response.content,
        });

        // Execute tools and collect results
        const toolResults: ToolResult[] = [];

        for (const toolUse of toolUses) {
          actions.push(`${toolUse.name}: ${JSON.stringify(toolUse.input)}`);

          const result = await toolExecutor.executeTool(toolUse.name, toolUse.input);

          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: result,
          });
        }

        // Add tool results to messages
        messages.push({
          role: 'user',
          content: toolResults,
        });
      } else {
        // No more tool calls, we have the final response
        finalResponse = textContent;
        continueLoop = false;
      }

      // Check stop reason
      if (response.stop_reason === 'end_turn' && toolUses.length === 0) {
        continueLoop = false;
      }
    }

    return {
      success: true,
      message: finalResponse || 'Command processed successfully.',
      actions,
    };
  } catch (error) {
    console.error('Agent error:', error);

    // Provide more helpful error messages
    const errorMessage = (error as Error).message;

    if (errorMessage.includes('ANTHROPIC_API_KEY')) {
      return {
        success: false,
        message: 'The notes agent is not configured. Please set the ANTHROPIC_API_KEY environment variable.',
        actions,
      };
    }

    return {
      success: false,
      message: `Failed to process command: ${errorMessage}`,
      actions,
    };
  }
}

// Lightweight command parser for simple operations that don't need Claude
export function parseSimpleCommand(command: string): { action: string; params: Record<string, string> } | null {
  const lowerCommand = command.toLowerCase().trim();

  // Simple list commands
  if (lowerCommand === 'list folders' || lowerCommand === 'show folders') {
    return { action: 'list_folders', params: {} };
  }

  // List notes in folder
  const listNotesMatch = lowerCommand.match(/^list notes in (\w+)$/);
  if (listNotesMatch) {
    return { action: 'list_notes', params: { folderId: listNotesMatch[1] } };
  }

  return null;
}

// Quick command execution without Claude API (for simple queries)
export async function executeQuickCommand(action: string, params: Record<string, string>, userId: string): Promise<AgentResponse> {
  const toolExecutor = new AgentToolExecutor(userId);
  const result = await toolExecutor.executeTool(action, params);

  try {
    const parsed = JSON.parse(result);

    if (parsed.error) {
      return {
        success: false,
        message: parsed.error,
      };
    }

    // Format response based on action
    if (action === 'list_folders') {
      const folders = parsed.folders || [];
      const folderList = folders.map((f: any) => `- ${f.name} (${f.id}): ${f.noteCount} notes`).join('\n');
      return {
        success: true,
        message: `Available folders:\n${folderList}`,
        data: parsed,
      };
    }

    if (action === 'list_notes') {
      const notes = parsed.notes || [];
      const noteList = notes.map((n: any) => `- ${n.title} (${n.id}): ${n.type}`).join('\n');
      return {
        success: true,
        message: `Notes found (${parsed.count}):\n${noteList}`,
        data: parsed,
      };
    }

    return {
      success: true,
      message: 'Command executed successfully.',
      data: parsed,
    };
  } catch {
    return {
      success: false,
      message: 'Failed to parse tool result',
    };
  }
}
