import type { UserProfile, UserProfileUpdate } from '../types';

// Mock user data
let mockUser: UserProfile = {
  id: '1',
  email: 'test@example.com',
  name: 'テストユーザー',
  bio: 'よろしくお願いします！',
  location: '東京都',
  createdAt: new Date().toISOString(),
  itemsCount: 0,
  purchasesCount: 0,
};

export async function getUserProfile(userId: string): Promise<UserProfile> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUser);
    }, 300);
  });
}

export async function updateUserProfile(
  userId: string,
  data: UserProfileUpdate
): Promise<UserProfile> {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockUser = { ...mockUser, ...data };
      
      // Update localStorage if current user
      if (typeof window !== 'undefined') {
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          const user = JSON.parse(currentUser);
          localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
        }
      }
      
      resolve(mockUser);
    }, 800);
  });
}

