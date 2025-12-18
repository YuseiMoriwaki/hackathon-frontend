'use client';

import useSWRMutation from 'swr/mutation';
import { updateItem } from '../api/itemsApi';
import type { ItemFormData } from '../types';
import { mutate } from 'swr';

export function useUpdateItem(itemId: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    `/api/items/${itemId}`,
    async (_key, { arg }: { arg: Partial<ItemFormData> }) => {
      return updateItem(itemId, arg);
    },
    {
      onSuccess: () => {
        // Revalidate items list and specific item
        mutate('/api/items');
        mutate(`/api/items/${itemId}`);
      },
    }
  );

  return {
    updateItem: trigger,
    isUpdating: isMutating,
    error,
  };
}
