'use client';

import { use } from 'react';
import { CheckoutPage } from '@/features/purchase';

export default function CheckoutPageRoute({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = use(params);

  return (
    <main className="flex-1 pt-32">
      <CheckoutPage itemId={itemId} />
    </main>
  );
}
