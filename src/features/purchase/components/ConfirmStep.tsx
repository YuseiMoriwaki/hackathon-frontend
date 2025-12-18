'use client';

import Image from 'next/image';
import { Button } from '@/components/ui';
import type { Item } from '@/features/items';
import type { ShippingAddress, PaymentMethod } from '../types';

interface ConfirmStepProps {
  item: Item;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string;
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  credit: 'クレジットカード',
  bank: '銀行振込',
  convenience: 'コンビニ払い',
};

export function ConfirmStep({
  item,
  shippingAddress,
  paymentMethod,
  onConfirm,
  onBack,
  isLoading,
  error,
}: ConfirmStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">注文内容の確認</h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Item Information */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">購入商品</h3>
        <div className="flex gap-4">
          <Image
            src={item.images[0] || 'https://placehold.co/100'}
            alt={item.title}
            width={100}
            height={100}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-2">{item.title}</h4>
            <p className="text-2xl font-bold text-blue-300">
              ¥{item.price}
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">配送先</h3>
        <div className="space-y-2 text-white/70">
          <p>
            <span className="font-medium text-white">{shippingAddress.name}</span>
          </p>
          <p>{shippingAddress.phone}</p>
          <p>
            〒{shippingAddress.postalCode}
            <br />
            {shippingAddress.prefecture}
            {shippingAddress.city}
            {shippingAddress.address}
            {shippingAddress.building && (
              <>
                <br />
                {shippingAddress.building}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">支払い方法</h3>
        <p className="text-white/70">{paymentMethodLabels[paymentMethod]}</p>
      </div>

      {/* Total */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-white">合計金額</span>
          <span className="text-3xl font-bold text-blue-300">
            ¥{item.price}
          </span>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={onBack} variant="secondary" className="flex-1" disabled={isLoading}>
          戻る
        </Button>
        <Button
          onClick={onConfirm}
          variant="primary"
          className="flex-1"
          isLoading={isLoading}
          disabled={isLoading}
        >
          注文を確定する
        </Button>
      </div>
    </div>
  );
}

