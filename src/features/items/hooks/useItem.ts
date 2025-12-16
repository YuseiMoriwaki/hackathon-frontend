'use client';

import useSWR from 'swr';
import { getItem } from '../api/itemsApi';
import type { Item } from '../types';

export function useItem(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Item>(
    id ? `/api/items/${id}` : null,
    () => getItem(id)
  );

  return {
    item: data,
    isLoading,
    isError: error,
    mutate,
  };
}

