import type { UserProfile, UserProfileUpdate } from '../types';
import { get, put } from '@/lib/api-client';

export async function getUserProfile(userId: string): Promise<UserProfile> {
  return get<UserProfile>(`/users/${userId}/profile`);
}

export async function updateUserProfile(
  userId: string,
  data: UserProfileUpdate
): Promise<UserProfile> {
  const response = await put<UserProfile>(`/users/${userId}/profile`, data);

  // Update localStorage if current user
  if (typeof window !== 'undefined') {
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        if (user.id === userId) {
          localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
        }
      } catch {
        // Invalid JSON in localStorage
      }
    }
  }

  return response;
}
