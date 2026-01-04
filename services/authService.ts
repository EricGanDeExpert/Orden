import { User } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Mock server-side storage (simulates a real backend)
// In production, this would be replaced with actual API calls
let mockUsers: { id: string; email: string; password: string; username: string; avatarUrl: string; plan: string; credits: number; maxCredits: number; createdAt: string }[] = [];
let currentSession: { token: string; userId: string } | null = null;

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper to simulate network delay
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Sign up a new user
export const signup = async (email: string, password: string, username: string): Promise<AuthResponse> => {
  await simulateDelay();

  // Check if email already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return { success: false, error: 'Email already registered' };
  }

  // Validate inputs
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Invalid email address' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }
  if (!username || username.length < 2) {
    return { success: false, error: 'Username must be at least 2 characters' };
  }

  // Create new user
  const newUser = {
    id: generateId(),
    email,
    password, // In production, this would be hashed
    username,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${generateId()}`,
    plan: 'Free',
    credits: 100,
    maxCredits: 100,
    createdAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);

  // Create session
  const token = generateId();
  currentSession = { token, userId: newUser.id };

  // Store in localStorage for persistence
  localStorage.setItem('auth_token', token);
  localStorage.setItem('users_db', JSON.stringify(mockUsers));

  const { password: _, ...userWithoutPassword } = newUser;
  return { success: true, user: userWithoutPassword, token };
};

// Log in an existing user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  await simulateDelay();

  // Load users from localStorage
  const storedUsers = localStorage.getItem('users_db');
  if (storedUsers) {
    mockUsers = JSON.parse(storedUsers);
  }

  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Create session
  const token = generateId();
  currentSession = { token, userId: user.id };
  localStorage.setItem('auth_token', token);

  const { password: _, ...userWithoutPassword } = user;
  return { success: true, user: userWithoutPassword, token };
};

// Log out the current user
export const logout = async (): Promise<{ success: boolean }> => {
  await simulateDelay(200);
  currentSession = null;
  localStorage.removeItem('auth_token');
  return { success: true };
};

// Get current user profile
export const getCurrentUser = async (): Promise<AuthResponse> => {
  await simulateDelay(300);

  const token = localStorage.getItem('auth_token');
  if (!token) {
    return { success: false, error: 'Not authenticated' };
  }

  // Load users from localStorage
  const storedUsers = localStorage.getItem('users_db');
  if (storedUsers) {
    mockUsers = JSON.parse(storedUsers);
  }

  // Find user by stored session or first matching token
  const user = mockUsers.find(u => currentSession?.userId === u.id) || mockUsers[mockUsers.length - 1];
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const { password: _, ...userWithoutPassword } = user;
  return { success: true, user: userWithoutPassword, token };
};

// Update user avatar
export const updateAvatar = async (avatarUrl: string): Promise<UpdateProfileResponse> => {
  await simulateDelay();

  const token = localStorage.getItem('auth_token');
  if (!token) {
    return { success: false, error: 'Not authenticated' };
  }

  // Load users from localStorage
  const storedUsers = localStorage.getItem('users_db');
  if (storedUsers) {
    mockUsers = JSON.parse(storedUsers);
  }

  const userIndex = mockUsers.findIndex(u => currentSession?.userId === u.id || u.id === mockUsers[mockUsers.length - 1]?.id);
  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }

  mockUsers[userIndex].avatarUrl = avatarUrl;
  localStorage.setItem('users_db', JSON.stringify(mockUsers));

  const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
  return { success: true, user: userWithoutPassword };
};

// Update username
export const updateUsername = async (newUsername: string): Promise<UpdateProfileResponse> => {
  await simulateDelay();

  if (!newUsername || newUsername.length < 2) {
    return { success: false, error: 'Username must be at least 2 characters' };
  }

  const token = localStorage.getItem('auth_token');
  if (!token) {
    return { success: false, error: 'Not authenticated' };
  }

  // Load users from localStorage
  const storedUsers = localStorage.getItem('users_db');
  if (storedUsers) {
    mockUsers = JSON.parse(storedUsers);
  }

  const userIndex = mockUsers.findIndex(u => currentSession?.userId === u.id || u.id === mockUsers[mockUsers.length - 1]?.id);
  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }

  mockUsers[userIndex].username = newUsername;
  localStorage.setItem('users_db', JSON.stringify(mockUsers));

  const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
  return { success: true, user: userWithoutPassword };
};

// Update password
export const updatePassword = async (currentPassword: string, newPassword: string): Promise<UpdateProfileResponse> => {
  await simulateDelay();

  if (newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters' };
  }

  const token = localStorage.getItem('auth_token');
  if (!token) {
    return { success: false, error: 'Not authenticated' };
  }

  // Load users from localStorage
  const storedUsers = localStorage.getItem('users_db');
  if (storedUsers) {
    mockUsers = JSON.parse(storedUsers);
  }

  const userIndex = mockUsers.findIndex(u => currentSession?.userId === u.id || u.id === mockUsers[mockUsers.length - 1]?.id);
  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }

  // Verify current password
  if (mockUsers[userIndex].password !== currentPassword) {
    return { success: false, error: 'Current password is incorrect' };
  }

  mockUsers[userIndex].password = newPassword;
  localStorage.setItem('users_db', JSON.stringify(mockUsers));

  const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
  return { success: true, user: userWithoutPassword };
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};
