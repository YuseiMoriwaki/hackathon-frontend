'use client';

import useSWRMutation from 'swr/mutation';
import { createItem } from '../api/itemsApi';
import type { ItemFormData } from '../types';
import { mutate } from 'swr';

export function useCreateItem() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/items',
    async (_key, { arg }: { arg: ItemFormData }) => {
      return createItem(arg);
    },
    {
      onSuccess: () => {
        // Revalidate items list
        mutate('/api/items');
      },
    }
  );

  return {
    createItem: trigger,
    isCreating: isMutating,
    error,
  };
}
