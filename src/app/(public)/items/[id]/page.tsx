'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ItemDetailPage } from '@/features/items';
import { Header } from '@/components/layouts';

export default function ItemDetailPageRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const handlePurchaseClick = () => {
    router.push(`/checkout/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ItemDetailPage 
          itemId={id} 
          onPurchaseClick={handlePurchaseClick}
        />
      </main>
    </div>
  );
}

