'use client';

import useSWRMutation from 'swr/mutation';
import { updateUserProfile } from '../api/userApi';
import type { UserProfileUpdate } from '../types';
import { mutate } from 'swr';

export function useUpdateUser(userId: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    `/api/users/${userId}`,
    async (_key, { arg }: { arg: UserProfileUpdate }) => {
      return updateUserProfile(userId, arg);
    },
    {
      onSuccess: () => {
        // Revalidate user profile and auth
        mutate(`/api/users/${userId}`);
        mutate('/api/auth/me');
      },
    }
  );

  return {
    updateUser: trigger,
    isUpdating: isMutating,
    error,
  };
}

