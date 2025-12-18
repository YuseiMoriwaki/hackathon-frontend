'use client';

import useSWRMutation from 'swr/mutation';
import { logout } from '../api/authApi';
import { mutate } from 'swr';

export function useLogout() {
  const { trigger, isMutating } = useSWRMutation(
    '/api/auth/logout',
    async () => {
      return logout();
    },
    {
      onSuccess: () => {
        // Clear the current user
        mutate('/api/auth/me', null, false);
      },
    }
  );

  return {
    logout: trigger,
    isLoading: isMutating,
  };
}
