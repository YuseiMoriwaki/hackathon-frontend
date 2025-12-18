'use client';

import { CreditCard, Building2, Store } from 'lucide-react';
import { Button } from '@/components/ui';
import type { PaymentMethod } from '../types';

interface PaymentStepProps {
  paymentMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  onNext: () => void;
  onBack: () => void;
}

const paymentOptions = [
  {
    value: 'credit' as PaymentMethod,
    label: 'クレジットカード',
    icon: CreditCard,
    description: 'Visa, Mastercard, JCB, AMEX',
  },
  {
    value: 'bank' as PaymentMethod,
    label: '銀行振込',
    icon: Building2,
    description: '振込手数料はお客様負担となります',
  },
  {
    value: 'convenience' as PaymentMethod,
    label: 'コンビニ払い',
    icon: Store,
    description: 'セブンイレブン、ローソン、ファミリーマート',
  },
];

export function PaymentStep({ paymentMethod, onChange, onNext, onBack }: PaymentStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">支払い方法</h2>

      <div className="space-y-4">
        {paymentOptions.map(option => {
          const Icon = option.icon;
          const isSelected = paymentMethod === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`w-full glass-card p-6 transition-all duration-300 hover:bg-white/10 ${
                isSelected ? 'ring-2 ring-blue-500/50 bg-white/5' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isSelected ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-300' : 'text-white/70'}`} />
                </div>
                <div className="flex-1 text-left">
                  <h3
                    className={`text-lg font-semibold mb-1 ${
                      isSelected ? 'text-white' : 'text-white/90'
                    }`}
                  >
                    {option.label}
                  </h3>
                  <p className="text-sm text-white/60">{option.description}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-white/30'
                  }`}
                >
                  {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={onBack} variant="secondary" className="flex-1">
          戻る
        </Button>
        <Button onClick={onNext} variant="primary" className="flex-1">
          次へ
        </Button>
      </div>
    </div>
  );
}
