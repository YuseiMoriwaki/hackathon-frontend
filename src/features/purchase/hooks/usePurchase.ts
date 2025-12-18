'use client';

import useSWRMutation from 'swr/mutation';
import { createPurchase } from '../api/purchaseApi';
import type { PurchaseRequest } from '../types';
import { mutate } from 'swr';

export function usePurchase() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/purchase',
    async (_key, { arg }: { arg: PurchaseRequest }) => {
      return createPurchase(arg);
    },
    {
      onSuccess: () => {
        // Revalidate purchase history and items
        mutate('/api/purchase/history');
        mutate('/api/items');
      },
    }
  );

  return {
    purchase: trigger,
    isPurchasing: isMutating,
    error,
  };
}
