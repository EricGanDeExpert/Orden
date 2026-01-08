import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './database';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
  plan: string;
  credits: number;
  maxCredits: number;
  createdAt: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
};

export const createUser = async (email: string, password: string, username: string): Promise<User> => {
  const id = randomUUID();
  const passwordHash = await hashPassword(password);

  const stmt = db.prepare(`
    INSERT INTO users (id, email, username, password_hash, avatar_url, plan, credits, max_credits)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, email, username, passwordHash, '', 'free', 100, 100);

  return getUserById(id)!;
};

export const getUserByEmail = (email: string): (User & { password_hash: string }) | undefined => {
  const stmt = db.prepare(`
    SELECT id, email, username, password_hash, avatar_url as avatarUrl,
           plan, credits, max_credits as maxCredits, created_at as createdAt
    FROM users WHERE email = ?
  `);

  return stmt.get(email) as any;
};

export const getUserById = (id: string): User | undefined => {
  const stmt = db.prepare(`
    SELECT id, email, username, avatar_url as avatarUrl,
           plan, credits, max_credits as maxCredits, created_at as createdAt
    FROM users WHERE id = ?
  `);

  return stmt.get(id) as User | undefined;
};

export const updateUserAvatar = (userId: string, avatarUrl: string): User | undefined => {
  const stmt = db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?');
  stmt.run(avatarUrl, userId);
  return getUserById(userId);
};

export const updateUsername = (userId: string, username: string): User | undefined => {
  const stmt = db.prepare('UPDATE users SET username = ? WHERE id = ?');
  stmt.run(username, userId);
  return getUserById(userId);
};

export const updatePassword = async (userId: string, newPassword: string): Promise<boolean> => {
  const passwordHash = await hashPassword(newPassword);
  const stmt = db.prepare('UPDATE users SET password_hash = ? WHERE id = ?');
  stmt.run(passwordHash, userId);
  return true;
};
