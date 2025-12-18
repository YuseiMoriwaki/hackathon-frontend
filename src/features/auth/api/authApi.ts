import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import { get, post } from '@/lib/api/api-client';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await post<AuthResponse>('/auth/login', {
    email: credentials.email,
    // Note: Backend dummy implementation doesn't require password
  });

  // Store token and user in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  return response;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await post<AuthResponse>('/auth/register', {
    email: data.email,
    name: data.name,
    // Note: Backend dummy implementation doesn't require password
  });

  // Store token and user in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  return response;
}

export async function logout(): Promise<void> {
  try {
    await post('/auth/logout');
  } finally {
    // Clear localStorage regardless of API response
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  // Try to restore from localStorage first
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }

    try {
      const user = await get<User>('/auth/me');
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch {
      // Token might be invalid, clear storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return null;
    }
  }

  return null;
}

export async function checkAuth(): Promise<boolean> {
  try {
    await get('/auth/check');
    return true;
  } catch {
    return false;
  }
}
