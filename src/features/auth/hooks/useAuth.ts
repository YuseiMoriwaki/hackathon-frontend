'use client';

import useSWR from 'swr';
import { getCurrentUser } from '../api/authApi';
import type { User } from '../types';

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR<User | null>('/api/auth/me', getCurrentUser, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return {
    user: data ?? null,
    isLoading,
    isError: error,
    isAuthenticated: !!data,
    mutate,
  };
}
