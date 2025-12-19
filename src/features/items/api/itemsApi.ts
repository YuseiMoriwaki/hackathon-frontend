import type { Item, ItemFormData, ItemFilters } from '../types';
import { get, post, put, del } from '@/lib/api/api-client';

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
  const response = await post<Item>('/items', {
    title: data.title,
    description: data.description,
    price: data.price,
    category: data.category,
    condition: 'Good', // Default condition
    brand_name: null, // Optional, can be added to form later
    images: data.images || [],
  });

  return response;
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

export async function getRecommendedItems(itemId: string, limit: number = 6): Promise<Item[]> {
  return get<Item[]>(`/items/${itemId}/recommended?limit=${limit}`);
}
