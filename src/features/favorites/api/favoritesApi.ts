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
    userId: string; // alias for user_id
    itemId: number; // alias for item_id
    createdAt: string; // alias for created_at
  }>('/favorites', {
    item_id: parseInt(itemId, 10),
  });

  return {
    id: response.id,
    userId: response.userId,
    itemId: response.itemId.toString(),
    createdAt: response.createdAt,
  };
}

export async function removeFavorite(userId: string, itemId: string): Promise<void> {
  await del('/favorites', {
    item_id: parseInt(itemId, 10),
  });
}
