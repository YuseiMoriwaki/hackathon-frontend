import type { Purchase, PurchaseRequest } from '../types';
import { get, post } from '@/lib/api-client';

export async function createPurchase(request: PurchaseRequest): Promise<Purchase> {
  const response = await post<{
    id: string;
    itemId: string;
    itemTitle: string;
    itemPrice: number;
    itemImage: string;
    buyerId: string;
    sellerId: string;
    status: string;
    createdAt: string;
    completedAt?: string;
  }>('/purchases', {
    item_id: parseInt(request.itemId, 10),
    payment_method: request.paymentMethod,
    shipping_address: {
      postal_code: request.shippingAddress.postalCode,
      prefecture: request.shippingAddress.prefecture,
      city: request.shippingAddress.city,
      address: request.shippingAddress.address,
      building: request.shippingAddress.building,
      name: request.shippingAddress.name,
      phone: request.shippingAddress.phone,
    },
  });

  return {
    id: response.id,
    itemId: response.itemId,
    itemTitle: response.itemTitle,
    itemPrice: response.itemPrice,
    itemImage: response.itemImage,
    buyerId: response.buyerId,
    sellerId: response.sellerId,
    status: response.status as 'pending' | 'completed' | 'cancelled',
    createdAt: response.createdAt,
    completedAt: response.completedAt,
  };
}

export async function getPurchaseHistory(userId: string): Promise<Purchase[]> {
  const purchases = await get<Array<{
    id: string;
    itemId: string;
    itemTitle: string;
    itemPrice: number;
    itemImage: string;
    buyerId: string;
    sellerId: string;
    status: string;
    createdAt: string;
    completedAt?: string;
  }>>(`/purchases/users/${userId}`);

  return purchases.map(p => ({
    id: p.id,
    itemId: p.itemId,
    itemTitle: p.itemTitle,
    itemPrice: p.itemPrice,
    itemImage: p.itemImage,
    buyerId: p.buyerId,
    sellerId: p.sellerId,
    status: p.status as 'pending' | 'completed' | 'cancelled',
    createdAt: p.createdAt,
    completedAt: p.completedAt,
  }));
}

export async function getPurchase(id: string): Promise<Purchase> {
  const response = await get<{
    id: string;
    itemId: string;
    itemTitle: string;
    itemPrice: number;
    itemImage: string;
    buyerId: string;
    sellerId: string;
    status: string;
    createdAt: string;
    completedAt?: string;
  }>(`/purchases/${id}`);

  return {
    id: response.id,
    itemId: response.itemId,
    itemTitle: response.itemTitle,
    itemPrice: response.itemPrice,
    itemImage: response.itemImage,
    buyerId: response.buyerId,
    sellerId: response.sellerId,
    status: response.status as 'pending' | 'completed' | 'cancelled',
    createdAt: response.createdAt,
    completedAt: response.completedAt,
  };
}
