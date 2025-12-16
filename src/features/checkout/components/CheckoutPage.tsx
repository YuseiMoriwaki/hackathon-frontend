'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layouts';
import { LoadingSpinner, GlassButton } from '@/components/ui';
import { useItem } from '@/features/items';
import { usePurchase } from '@/features/purchase/hooks/usePurchase';
import type { CheckoutStep, ShippingAddress, PaymentMethod } from '../types';
import { ProgressBar } from './ProgressBar';
import { ShippingStep } from './ShippingStep';
import { PaymentStep } from './PaymentStep';
import { ConfirmStep } from './ConfirmStep';

interface CheckoutPageProps {
  itemId: string;
}

export function CheckoutPage({ itemId }: CheckoutPageProps) {
  const router = useRouter();
  const { item, isLoading: itemLoading } = useItem(itemId);
  const { purchase, isPurchasing } = usePurchase();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [error, setError] = useState<string>('');

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    postalCode: '150-0001',
    prefecture: '東京都',
    city: '渋谷区',
    address: '神宮前1-2-3',
    building: 'サンプルビル101',
    name: '山田太郎',
    phone: '090-1234-5678',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');

  const validateShippingAddress = (): boolean => {
    if (
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.postalCode ||
      !shippingAddress.prefecture ||
      !shippingAddress.city ||
      !shippingAddress.address
    ) {
      setError('必須項目をすべて入力してください');
      return false;
    }

    // Validate phone number
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

  const handleShippingNext = () => {
    if (validateShippingAddress()) {
      setCurrentStep('payment');
    }
  };

  const handlePaymentNext = () => {
    setCurrentStep('confirm');
  };

  const handleConfirm = async () => {
    if (!item) return;

    setError('');
    try {
      await purchase({
        itemId: item.id,
        paymentMethod,
        shippingAddress,
      });

      setCurrentStep('complete');
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/user/purchases');
      }, 2000);
    } catch (error) {
      setError('購入に失敗しました。もう一度お試しください。');
      console.error('Purchase error:', error);
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'confirm') {
      setCurrentStep('payment');
    } else {
      router.back();
    }
  };

  if (itemLoading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <p className="text-red-300 mb-4">商品が見つかりません</p>
        </div>
      </Container>
    );
  }

  if (item.status !== 'available') {
    return (
      <Container className="py-8">
        <div className="text-center">
          <p className="text-yellow-300 mb-4">この商品は現在購入できません</p>
        </div>
      </Container>
    );
  }

  if (currentStep === 'complete') {
    return (
      <Container className="py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
          <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
            <div className="text-green-400 text-5xl">✓</div>
          </div>
          <h2 className="text-3xl font-bold text-white">購入が完了しました！</h2>
          <p className="text-white/70 text-lg">
            ご購入ありがとうございます。
            <br />
            購入履歴ページへ移動します...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* Fixed Back Button and Progress Bar Container */}
      <div className="fixed top-16 left-0 right-0 z-30 bg-transparent backdrop-blur-md border-b border-white/10">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 md:px-6">
          <GlassButton onClick={handleBack} ariaLabel="戻る" className="shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </GlassButton>
          <div className="flex justify-center">
            <div className="max-w-md w-full">
              <ProgressBar currentStep={currentStep} />
            </div>
          </div>
          <div className="w-12"></div>
        </div>
      </div>

      <Container className="py-8">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8">
            {currentStep === 'shipping' && (
              <ShippingStep
                shippingAddress={shippingAddress}
                onChange={setShippingAddress}
                onNext={handleShippingNext}
                onBack={handleBack}
                error={error}
              />
            )}

            {currentStep === 'payment' && (
              <PaymentStep
                paymentMethod={paymentMethod}
                onChange={setPaymentMethod}
                onNext={handlePaymentNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 'confirm' && (
              <ConfirmStep
                item={item}
                shippingAddress={shippingAddress}
                paymentMethod={paymentMethod}
                onConfirm={handleConfirm}
                onBack={handleBack}
                isLoading={isPurchasing}
                error={error}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
