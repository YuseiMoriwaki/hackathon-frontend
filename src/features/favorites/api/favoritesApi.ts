import type { Favorite } from '../types';
import { get, post, del } from '@/lib/api/api-client';

export async function getUserFavorites(userId: string): Promise<string[]> {
  const itemIds = await get<number[]>(`/favorites/users/${userId}`);
  // Convert numbers to strings to match frontend type
  return itemIds.map(id => id.toString());
}

export async function addFavorite(userId: string, itemId: string): Promise<Favorite> {
  const response = await post<{
    id: string;
    user_id: string;
    item_id: number;
    created_at: string;
  }>('/favorites', {
    item_id: parseInt(itemId, 10),
  });

  return {
    id: response.id,
    userId: response.user_id,
    itemId: response.item_id.toString(),
    createdAt: response.created_at,
  };
}

export async function removeFavorite(userId: string, itemId: string): Promise<void> {
  await del('/favorites', {
    item_id: parseInt(itemId, 10),
  });
}
