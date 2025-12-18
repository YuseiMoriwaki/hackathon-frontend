export type ItemStatus = 'active' | 'available' | 'sold' | 'removed' | 'reserved';
export type ItemCategory = 'fashion' | 'electronics' | 'books' | 'sports' | 'home' | 'other';

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: ItemCategory;
  status: ItemStatus;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemFormData {
  title: string;
  description: string;
  price: number;
  images: string[];
  category: ItemCategory;
}

export interface ItemFilters {
  category?: ItemCategory;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  status?: ItemStatus;
}
