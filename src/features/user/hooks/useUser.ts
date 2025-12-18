'use client';

import useSWR from 'swr';
import { getUserProfile } from '../api/userApi';
import type { UserProfile } from '../types';

export function useUser(userId: string) {
  const { data, error, isLoading, mutate } = useSWR<UserProfile>(
    userId ? `/api/users/${userId}` : null,
    () => getUserProfile(userId)
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
}
