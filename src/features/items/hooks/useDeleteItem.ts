'use client';

import useSWRMutation from 'swr/mutation';
import { deleteItem } from '../api/itemsApi';
import { mutate } from 'swr';

export function useDeleteItem() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/items/delete',
    async (_key, { arg }: { arg: string }) => {
      return deleteItem(arg);
    },
    {
      onSuccess: () => {
        // Revalidate items list
        mutate('/api/items');
      },
    }
  );

  return {
    deleteItem: trigger,
    isDeleting: isMutating,
    error,
  };
}
