'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Modal, Button, Input } from '@/components/ui';
import type { Item } from '@/features/items';
import type { ShippingAddress } from '../types';
import { usePurchase } from '../hooks/usePurchase';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  onSuccess?: () => void;
}

export function PurchaseModal({ isOpen, onClose, item, onSuccess }: PurchaseModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<'confirm' | 'shipping' | 'payment' | 'complete'>('confirm');
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'bank' | 'convenience'>('credit');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    postalCode: '',
    prefecture: '',
    city: '',
    address: '',
    building: '',
    name: '',
    phone: '',
  });
  const [error, setError] = useState<string>('');

  const { purchase, isPurchasing } = usePurchase();

  const validateShippingAddress = (): boolean => {
    if (!shippingAddress.name || !shippingAddress.phone || 
        !shippingAddress.postalCode || !shippingAddress.prefecture || 
        !shippingAddress.city || !shippingAddress.address) {
      setError('必須項目をすべて入力してください');
      return false;
    }
    
    // Validate phone number (basic)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(shippingAddress.phone.replace(/-/g, ''))) {
      setError('正しい電話番号を入力してください');
      return false;
    }
    
    // Validate postal code
    const postalRegex = /^[0-9]{3}-?[0-9]{4}$/;
    if (!postalRegex.test(shippingAddress.postalCode)) {
      setError('正しい郵便番号を入力してください（例：123-4567）');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleNextToPayment = () => {
    if (validateShippingAddress()) {
      setStep('payment');
    }
  };

  const handlePurchase = async () => {
    setError('');
    try {
      // Create purchase record (API内でアイテムのステータスも更新される)
      await purchase({
        itemId: item.id,
        paymentMethod,
        shippingAddress,
      });
      
      setStep('complete');
    } catch (error) {
      setError('購入に失敗しました。もう一度お試しください。');
      console.error('Purchase error:', error);
    }
  };

  const handleCompleteClose = () => {
    handleClose();
    if (onSuccess) {
      onSuccess();
    } else {
      // Redirect to purchase history
      router.push('/user/purchases');
    }
  };

  const handleClose = () => {
    setStep('confirm');
    setPaymentMethod('credit');
    setShippingAddress({
      postalCode: '',
      prefecture: '',
      city: '',
      address: '',
      building: '',
      name: '',
      phone: '',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="購入手続き" size="lg">
      {step === 'confirm' && (
        <div className="space-y-6">
          <div className="flex gap-4 glass-card p-4">
            <Image
              src={item.images[0] || 'https://placehold.co/100'}
              alt={item.title}
              width={100}
              height={100}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-lg text-white">{item.title}</h3>
              <p className="text-2xl font-bold text-blue-300 mt-2">
                ¥{item.price}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-white/70 mb-4">
              こちらの商品を購入しますか？
            </p>
            <div className="flex gap-3">
              <Button onClick={handleClose} variant="secondary" className="flex-1">
                キャンセル
              </Button>
              <Button onClick={() => setStep('shipping')} variant="primary" className="flex-1">
                購入手続きへ
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 'shipping' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg mb-4 text-white">配送先情報</h3>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <Input
            label="お名前"
            value={shippingAddress.name}
            onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
            required
            error={!shippingAddress.name && error ? '必須項目です' : ''}
          />
          
          <Input
            label="電話番号"
            value={shippingAddress.phone}
            onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="09012345678"
            required
            error={!shippingAddress.phone && error ? '必須項目です' : ''}
          />
          
          <Input
            label="郵便番号"
            value={shippingAddress.postalCode}
            onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
            placeholder="123-4567"
            required
            error={!shippingAddress.postalCode && error ? '必須項目です' : ''}
          />
          
          <Input
            label="都道府県"
            value={shippingAddress.prefecture}
            onChange={(e) => setShippingAddress(prev => ({ ...prev, prefecture: e.target.value }))}
            placeholder="東京都"
            required
            error={!shippingAddress.prefecture && error ? '必須項目です' : ''}
          />
          
          <Input
            label="市区町村"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
            placeholder="渋谷区"
            required
            error={!shippingAddress.city && error ? '必須項目です' : ''}
          />
          
          <Input
            label="番地"
            value={shippingAddress.address}
            onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
            placeholder="道玄坂1-2-3"
            required
            error={!shippingAddress.address && error ? '必須項目です' : ''}
          />
          
          <Input
            label="建物名・部屋番号（任意）"
            value={shippingAddress.building}
            onChange={(e) => setShippingAddress(prev => ({ ...prev, building: e.target.value }))}
            placeholder="〇〇ビル 4F"
          />

          <div className="flex gap-3 pt-4">
            <Button onClick={() => setStep('confirm')} variant="secondary" className="flex-1">
              戻る
            </Button>
            <Button onClick={handleNextToPayment} variant="primary" className="flex-1">
              次へ
            </Button>
          </div>
        </div>
      )}

      {step === 'payment' && (
        <div className="space-y-6">
          <h3 className="font-semibold text-lg mb-4 text-white">支払い方法</h3>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <label className={`flex items-center p-4 glass-card cursor-pointer hover:bg-white/10 transition-all duration-300 ${
              paymentMethod === 'credit' ? 'ring-2 ring-blue-500/50' : ''
            }`}>
              <input
                type="radio"
                name="payment"
                value="credit"
                checked={paymentMethod === 'credit'}
                onChange={(e) => setPaymentMethod(e.target.value as 'credit' | 'bank' | 'convenience')}
                className="mr-3"
              />
              <span className="text-white">クレジットカード</span>
            </label>
            
            <label className={`flex items-center p-4 glass-card cursor-pointer hover:bg-white/10 transition-all duration-300 ${
              paymentMethod === 'bank' ? 'ring-2 ring-blue-500/50' : ''
            }`}>
              <input
                type="radio"
                name="payment"
                value="bank"
                checked={paymentMethod === 'bank'}
                onChange={(e) => setPaymentMethod(e.target.value as 'credit' | 'bank' | 'convenience')}
                className="mr-3"
              />
              <span className="text-white">銀行振込</span>
            </label>
            
            <label className={`flex items-center p-4 glass-card cursor-pointer hover:bg-white/10 transition-all duration-300 ${
              paymentMethod === 'convenience' ? 'ring-2 ring-blue-500/50' : ''
            }`}>
              <input
                type="radio"
                name="payment"
                value="convenience"
                checked={paymentMethod === 'convenience'}
                onChange={(e) => setPaymentMethod(e.target.value as 'credit' | 'bank' | 'convenience')}
                className="mr-3"
              />
              <span className="text-white">コンビニ払い</span>
            </label>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span className="text-white">合計金額</span>
              <span className="text-blue-300">¥{item.price}</span>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep('shipping')} variant="secondary" className="flex-1">
                戻る
              </Button>
              <Button 
                onClick={handlePurchase} 
                variant="primary" 
                className="flex-1"
                isLoading={isPurchasing}
                disabled={isPurchasing}
              >
                購入を確定する
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="text-center space-y-6 py-4">
          <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
            <div className="text-green-400 text-5xl">✓</div>
          </div>
          <h3 className="text-2xl font-bold text-white">購入が完了しました！</h3>
          <p className="text-white/70">
            ご購入ありがとうございます。<br />
            購入履歴から詳細を確認できます。
          </p>
          <Button onClick={handleCompleteClose} variant="primary" className="w-full">
            購入履歴を見る
          </Button>
        </div>
      )}
    </Modal>
  );
}
