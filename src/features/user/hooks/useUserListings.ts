'use client';

import useSWR from 'swr';
import { getUserItems } from '@/features/items/api/itemsApi';
import type { Item } from '@/features/items';

export function useUserListings(userId: string) {
  const { data, error, isLoading, mutate } = useSWR<Item[]>(
    userId ? `/api/users/${userId}/items` : null,
    () => getUserItems(userId)
  );

  return {
    items: data,
    isLoading,
    isError: error,
    mutate,
  };
}

