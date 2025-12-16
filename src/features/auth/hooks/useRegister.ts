'use client';

import useSWRMutation from 'swr/mutation';
import { register } from '../api/authApi';
import type { RegisterData } from '../types';
import { mutate } from 'swr';

export function useRegister() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/auth/register',
    async (_key, { arg }: { arg: RegisterData }) => {
      return register(arg);
    },
    {
      onSuccess: () => {
        // Revalidate the current user
        mutate('/api/auth/me');
      },
    }
  );

  return {
    register: trigger,
    isLoading: isMutating,
    error,
  };
}

