'use client';

import useSWR from 'swr';
import { getPurchaseHistory } from '../api/purchaseApi';
import type { Purchase } from '../types';

export function usePurchaseHistory(userId: string) {
  const { data, error, isLoading, mutate } = useSWR<Purchase[]>(
    userId ? `/api/purchase/history/${userId}` : null,
    () => getPurchaseHistory(userId)
  );

  return {
    purchases: data,
    isLoading,
    isError: error,
    mutate,
  };
}

