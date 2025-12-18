'use client';

import { Button, Input } from '@/components/ui';
import type { ShippingAddress } from '../types';

interface ShippingStepProps {
  shippingAddress: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
  onNext: () => void;
  onBack: () => void;
  error?: string;
}

export function ShippingStep({
  shippingAddress,
  onChange,
  onNext,
  onBack,
  error,
}: ShippingStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">配送先情報</h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="お名前"
          value={shippingAddress.name}
          onChange={(e) => onChange({ ...shippingAddress, name: e.target.value })}
          required
          placeholder="山田 太郎"
        />

        <Input
          label="電話番号"
          value={shippingAddress.phone}
          onChange={(e) => onChange({ ...shippingAddress, phone: e.target.value })}
          required
          placeholder="09012345678"
        />
      </div>

      <Input
        label="郵便番号"
        value={shippingAddress.postalCode}
        onChange={(e) => onChange({ ...shippingAddress, postalCode: e.target.value })}
        required
        placeholder="123-4567"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="都道府県"
          value={shippingAddress.prefecture}
          onChange={(e) => onChange({ ...shippingAddress, prefecture: e.target.value })}
          required
          placeholder="東京都"
        />

        <Input
          label="市区町村"
          value={shippingAddress.city}
          onChange={(e) => onChange({ ...shippingAddress, city: e.target.value })}
          required
          placeholder="渋谷区"
        />
      </div>

      <Input
        label="番地"
        value={shippingAddress.address}
        onChange={(e) => onChange({ ...shippingAddress, address: e.target.value })}
        required
        placeholder="道玄坂1-2-3"
      />

      <Input
        label="建物名・部屋番号（任意）"
        value={shippingAddress.building || ''}
        onChange={(e) => onChange({ ...shippingAddress, building: e.target.value })}
        placeholder="〇〇ビル 4F"
      />

      <div className="flex gap-4 pt-4">
        <Button onClick={onBack} variant="secondary" className="flex-1">
          キャンセル
        </Button>
        <Button onClick={onNext} variant="primary" className="flex-1">
          次へ
        </Button>
      </div>
    </div>
  );
}

