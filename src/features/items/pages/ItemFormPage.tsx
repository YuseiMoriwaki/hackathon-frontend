'use client';

import { useRouter } from 'next/navigation';
import { Container } from '@/components/layouts';
import { LoadingSpinner } from '@/components/ui';
import { ItemForm } from '../components/ItemForm';
import { useCreateItem } from '../hooks/useCreateItem';
import { useUpdateItem } from '../hooks/useUpdateItem';
import { useItem } from '../hooks/useItem';
import type { ItemFormData } from '../types';

interface ItemFormPageProps {
  itemId?: string;
}

export function ItemFormPage({ itemId }: ItemFormPageProps) {
  const router = useRouter();
  const { item, isLoading: isLoadingItem } = useItem(itemId || '');
  const { createItem, isCreating } = useCreateItem();
  const { updateItem, isUpdating } = useUpdateItem(itemId || '');

  const isEditing = !!itemId;
  const isLoading = isEditing ? isLoadingItem : false;
  const isSaving = isEditing ? isUpdating : isCreating;

  const handleSubmit = async (data: ItemFormData) => {
    try {
      if (isEditing && itemId) {
        await updateItem(data);
        router.push(`/items/${itemId}`);
      } else {
        const newItem = await createItem(data);
        router.push(`/items/${newItem.id}`);
      }
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  if (isEditing && !item) {
    return (
      <Container className="py-8">
        <div className="text-center text-red-300">
          商品が見つかりません
        </div>
      </Container>
    );
  }

  return (
    <Container size="md" className="py-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        {isEditing ? '商品を編集' : '商品を出品'}
      </h1>

      <div className="glass-card p-6 rounded-2xl">
        <ItemForm
          initialData={item}
          onSubmit={handleSubmit}
          isLoading={isSaving}
        />
      </div>
    </Container>
  );
}
