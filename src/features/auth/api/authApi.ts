import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types';

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'テストユーザー',
    avatar: '',
    createdAt: new Date().toISOString(),
  },
];

// Mock current user (simulating logged in state)
let currentUser: User | null = null;

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simple mock authentication
      if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        const user = mockUsers[0];
        currentUser = user;
        
        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', 'mock-token-123');
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        resolve({ user, token: 'mock-token-123' });
      } else {
        reject(new Error('メールアドレスまたはパスワードが正しくありません'));
      }
    }, 800);
  });
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        createdAt: new Date().toISOString(),
      };
      
      mockUsers.push(newUser);
      currentUser = newUser;
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', 'mock-token-' + newUser.id);
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      
      resolve({ user: newUser, token: 'mock-token-' + newUser.id });
    }, 800);
  });
}

export async function logout(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = null;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
      
      resolve();
    }, 300);
  });
}

export async function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Try to restore from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            currentUser = user;
            resolve(user);
            return;
          } catch (e) {
            // Invalid data
          }
        }
      }
      
      resolve(currentUser);
    }, 300);
  });
}

export async function checkAuth(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

