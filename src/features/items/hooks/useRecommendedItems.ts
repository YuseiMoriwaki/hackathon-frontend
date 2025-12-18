'use client';

import useSWR from 'swr';
import { getRecommendedItems } from '../api/itemsApi';
import type { Item, ItemCategory } from '../types';

export function useRecommendedItems(itemId: string, category: ItemCategory, limit: number = 6) {
  const { data, error, isLoading } = useSWR<Item[]>(
    itemId && category ? `/api/items/${itemId}/recommended?category=${category}` : null,
    () => getRecommendedItems(itemId, category, limit)
  );

  return {
    items: data || [],
    isLoading,
    isError: error,
  };
}
