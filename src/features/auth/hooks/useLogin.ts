'use client';

import useSWRMutation from 'swr/mutation';
import { login } from '../api/authApi';
import type { LoginCredentials } from '../types';
import { mutate } from 'swr';

export function useLogin() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/auth/login',
    async (_key, { arg }: { arg: LoginCredentials }) => {
      return login(arg);
    },
    {
      onSuccess: () => {
        // Revalidate the current user
        mutate('/api/auth/me');
      },
    }
  );

  return {
    login: trigger,
    isLoading: isMutating,
    error,
  };
}
