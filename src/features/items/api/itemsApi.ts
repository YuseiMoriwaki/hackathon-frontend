import type { Item, ItemFormData, ItemFilters, ItemCategory } from '../types';
import { get, put, del } from '@/lib/api/api-client';

export async function getItems(filters?: ItemFilters): Promise<Item[]> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.minPrice !== undefined) params.append('min_price', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('max_price', filters.maxPrice.toString());
    if (filters.search) params.append('search', filters.search);
  }

  const queryString = params.toString();
  const endpoint = `/items${queryString ? `?${queryString}` : ''}`;

  return get<Item[]>(endpoint);
}

export async function getItem(id: string): Promise<Item> {
  return get<Item>(`/items/${id}`);
}

export async function createItem(data: ItemFormData): Promise<Item> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Get current user from localStorage (same logic as Header)
      let currentUser = null;
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            currentUser = JSON.parse(userStr);
          } catch (e) {
            console.error('Failed to parse user from localStorage', e);
          }
        }
      }

      // Ensure user is authenticated
      if (!currentUser) {
        reject(new Error('ユーザー情報が見つかりません。ログインしてください。'));
        return;
      }

      const newItem: Item = {
        ...data,
        id: Date.now().toString(),
        status: 'active',
        sellerId: currentUser.id, // Use current user's ID
        sellerName: currentUser.name, // Use current user's name
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      resolve(newItem);
    }, 800);
  });
}

export async function updateItem(id: string, data: Partial<ItemFormData>): Promise<Item> {
  return put<Item>(`/items/${id}`, data);
}

export async function deleteItem(id: string): Promise<void> {
  await del(`/items/${id}`);
}

export async function getUserItems(userId: string): Promise<Item[]> {
  return get<Item[]>(`/users/${userId}/items`);
}

export async function getRecommendedItems(
  itemId: string,
  category: ItemCategory,
  limit: number = 6
): Promise<Item[]> {
  return get<Item[]>(`/items/${itemId}/recommended?limit=${limit}`);
}
