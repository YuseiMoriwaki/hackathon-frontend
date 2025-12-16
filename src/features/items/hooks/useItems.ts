'use client';

import useSWR from 'swr';
import { getItems } from '../api/itemsApi';
import type { Item, ItemFilters } from '../types';

export function useItems(filters?: ItemFilters) {
  const key = filters ? ['/api/items', filters] : '/api/items';
  
  const { data, error, isLoading, mutate } = useSWR<Item[]>(
    key,
    () => getItems(filters)
  );

  return {
    items: data,
    isLoading,
    isError: error,
    mutate,
  };
}

