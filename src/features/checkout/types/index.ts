export type CheckoutStep = 'shipping' | 'payment' | 'confirm' | 'complete';

export type PaymentMethod = 'credit' | 'bank' | 'convenience';

export interface ShippingAddress {
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
  building?: string;
  name: string;
  phone: string;
}

export interface CheckoutData {
  itemId: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

