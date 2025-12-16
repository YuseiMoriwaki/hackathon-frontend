'use client';

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getUserFavorites, addFavorite, removeFavorite } from '../api/favoritesApi';

export function useFavorites(userId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/favorites/${userId}` : null,
    () => getUserFavorites(userId!)
  );

  return {
    favorites: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useAddFavorite(userId: string | undefined) {
  const { trigger, isMutating } = useSWRMutation(
    userId ? `/api/favorites/${userId}` : null,
    async (_, { arg }: { arg: string }) => {
      if (!userId) throw new Error('User ID is required');
      return addFavorite(userId, arg);
    }
  );

  return {
    addFavorite: trigger,
    isAdding: isMutating,
  };
}

export function useRemoveFavorite(userId: string | undefined) {
  const { trigger, isMutating } = useSWRMutation(
    userId ? `/api/favorites/${userId}` : null,
    async (_, { arg }: { arg: string }) => {
      if (!userId) throw new Error('User ID is required');
      return removeFavorite(userId, arg);
    }
  );

  return {
    removeFavorite: trigger,
    isRemoving: isMutating,
  };
}

