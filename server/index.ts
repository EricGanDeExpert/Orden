import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { initDatabase } from './database';
import * as auth from './auth';
import * as notes from './notes';
import { processAgentCommand, parseSimpleCommand, executeQuickCommand } from './agent/agentService';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// Auth middleware
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  const payload = auth.verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  (req as any).userId = payload.userId;
  next();
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = auth.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await auth.createUser(email, password, username);
    const token = auth.generateToken(user.id);

    res.json({ user, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = auth.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await auth.comparePassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = auth.generateToken(user.id);
    const { password_hash, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticate, (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = auth.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/auth/avatar', authenticate, (req, res) => {
  try {
    const userId = (req as any).userId;
    const { avatarUrl } = req.body;

    const user = auth.updateUserAvatar(userId, avatarUrl);
    res.json({ user });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/auth/username', authenticate, (req, res) => {
  try {
    const userId = (req as any).userId;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const user = auth.updateUsername(userId, username);
    res.json({ user });
  } catch (error) {
    console.error('Update username error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/auth/password', authenticate, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = auth.getUserByEmail((auth.getUserById(userId) as any).email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await auth.comparePassword(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    await auth.updatePassword(userId, newPassword);
    res.json({ success: true });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Note endpoints
app.get('/api/notes/edits', authenticate, (req, res) => {
  try {
    const userId = (req as any).userId;
    const edits = notes.getUserNoteEdits(userId);
    res.json({ edits });
  } catch (error) {
    console.error('Get edits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/notes/edits', authenticate, (req, res) => {
  try {
    const userId = (req as any).userId;
    const { noteId, folderId, title, content, subtitle } = req.body;

    if (!noteId || !folderId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const edit = notes.saveNoteEdit(userId, noteId, folderId, title, content, subtitle);
    res.json({ edit });
  } catch (error) {
    console.error('Save edit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/notes/edits/:noteId', authenticate, (req, res) => {
  try {
    const userId = (req as any).userId;
    const { noteId } = req.params;

    const success = notes.deleteNoteEdit(userId, noteId);
    res.json({ success });
  } catch (error) {
    console.error('Delete edit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/notes/custom', authenticate, (req, res) => {
  try {
    const userId = (req as any).userId;
    const { folderId } = req.query;

    const customNotes = notes.getCustomNotes(userId, folderId as string);
    res.json({ notes: customNotes });
  } catch (error) {
    console.error('Get custom notes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/notes/custom', authenticate, (req, res) => {
  try {
    const userId = (req as any).userId;
    const { folderId, type, title, subtitle, content, date } = req.body;

    if (!folderId || !type || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const note = notes.createCustomNote(userId, folderId, type, title, subtitle || '', content || '', date);
    res.json({ note });
  } catch (error) {
    console.error('Create custom note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/notes/custom/:noteId', authenticate, (req, res) => {
  try {
    const userId = (req as any).userId;
    const { noteId } = req.params;

    const success = notes.deleteCustomNote(userId, noteId);
    res.json({ success });
  } catch (error) {
    console.error('Delete custom note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Agent endpoint - Process natural language commands for note management
app.post('/api/agent/command', authenticate, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { command, conversationHistory } = req.body;

    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    // Check if this is a simple command that can be handled without Claude API
    const simpleCommand = parseSimpleCommand(command);
    if (simpleCommand) {
      const result = await executeQuickCommand(simpleCommand.action, simpleCommand.params, userId);
      return res.json(result);
    }

    // Process complex command with Claude agent
    const result = await processAgentCommand({
      command,
      userId,
      conversationHistory,
    });

    res.json(result);
  } catch (error) {
    console.error('Agent command error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process agent command',
      error: (error as Error).message,
    });
  }
});

// Agent health check
app.get('/api/agent/status', (req, res) => {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
  res.json({
    status: hasApiKey ? 'ready' : 'not_configured',
    message: hasApiKey
      ? 'Notes agent is ready to process commands'
      : 'ANTHROPIC_API_KEY is not configured',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
