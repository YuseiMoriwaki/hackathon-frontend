'use client';

import { use } from 'react';
import { Header } from '@/components/layouts';
import { CheckoutPage } from '@/features/purchase';

export default function CheckoutPageRoute({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = use(params);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32">
        <CheckoutPage itemId={itemId} />
      </main>
    </div>
  );
}

