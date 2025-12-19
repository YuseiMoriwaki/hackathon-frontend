'use client';

import useSWR from 'swr';
import { getRecommendedItems } from '../api/itemsApi';
import type { Item } from '../types';

export function useRecommendedItems(itemId: string, limit: number = 6) {
  const { data, error, isLoading } = useSWR<Item[]>(
    itemId ? `/api/items/${itemId}/recommended?limit=${limit}` : null,
    () => getRecommendedItems(itemId, limit)
  );

  return {
    items: data || [],
    isLoading,
    isError: error,
  };
}
