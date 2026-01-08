import { User } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

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

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Sign up a new user
export const signup = async (email: string, password: string, username: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Signup failed' };
    }

    // Store token
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }

    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// Log in an existing user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }

    // Store token
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }

    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// Log out the current user
export const logout = async (): Promise<{ success: boolean }> => {
  localStorage.removeItem('auth_token');
  return { success: true };
};

// Get current user profile
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to get user' };
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Get user error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Update user avatar
export const updateAvatar = async (avatarUrl: string): Promise<UpdateProfileResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/avatar`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ avatarUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update avatar' };
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Update avatar error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Update username
export const updateUsername = async (newUsername: string): Promise<UpdateProfileResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/username`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ username: newUsername }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update username' };
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Update username error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Update password
export const updatePassword = async (currentPassword: string, newPassword: string): Promise<UpdateProfileResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update password' };
    }

    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};
