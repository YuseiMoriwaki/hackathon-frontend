'use client';

import { ItemListPage } from '@/features/items';
import { BottomNav } from '@/components/layouts';

export default function ItemsPage() {
  return (
    <>
      <main className="flex-1 pt-16 pb-24">
        <ItemListPage />
      </main>
      <BottomNav />
    </>
  );
}
