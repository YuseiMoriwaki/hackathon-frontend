export interface Purchase {
  id: string;
  itemId: string;
  itemTitle: string;
  itemPrice: number;
  itemImage: string;
  buyerId: string;
  sellerId: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface PurchaseRequest {
  itemId: string;
  paymentMethod: 'credit' | 'bank' | 'convenience';
  shippingAddress: ShippingAddress;
}

export interface ShippingAddress {
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
  building?: string;
  name: string;
  phone: string;
}

