'use client';

import { ItemListPage } from '@/features/items';
import { Header, BottomNav } from '@/components/layouts';

export default function ItemsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 pb-24">
        <ItemListPage />
      </main>
      <BottomNav />
    </div>
  );
}

