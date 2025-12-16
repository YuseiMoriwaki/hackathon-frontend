import type { Purchase, PurchaseRequest } from '../types';
import { getItem, updateItem } from '@/features/items/api/itemsApi';

// Mock purchases
let mockPurchases: Purchase[] = [];

export async function createPurchase(request: PurchaseRequest): Promise<Purchase> {
  // アイテム情報を取得
  const item = await getItem(request.itemId);
  
  // アイテムのステータスを sold に更新
  await updateItem(request.itemId, { status: 'sold' as any });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPurchase: Purchase = {
        id: Date.now().toString(),
        itemId: request.itemId,
        itemTitle: item.title,
        itemPrice: item.price,
        itemImage: item.images[0] || 'https://placehold.co/400',
        buyerId: '1', // Current user
        sellerId: item.sellerId,
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      
      mockPurchases = [newPurchase, ...mockPurchases];
      resolve(newPurchase);
    }, 1000);
  });
}

export async function getPurchaseHistory(userId: string): Promise<Purchase[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userPurchases = mockPurchases.filter(p => p.buyerId === userId);
      resolve(userPurchases);
    }, 500);
  });
}

export async function getPurchase(id: string): Promise<Purchase> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const purchase = mockPurchases.find(p => p.id === id);
      if (purchase) {
        resolve(purchase);
      } else {
        reject(new Error('購入情報が見つかりません'));
      }
    }, 300);
  });
}

