'use client';

import { useState } from 'react';
import { Container } from '@/components/layouts';
import { LoadingSpinner } from '@/components/ui';
import { ItemCard } from '../components/ItemCard';
import { SearchFilters } from '../components/SearchFilters';
import { useItems } from '../hooks/useItems';
import type { ItemFilters } from '../types';

export function ItemListPage() {
  const [filters, setFilters] = useState<ItemFilters>({ status: 'available' });
  const { items, isLoading, isError } = useItems(filters);

  if (isError) {
    return (
      <Container className="py-8">
        <div className="text-center text-red-300">
          商品の読み込みに失敗しました
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold text-white mb-8">商品一覧</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters
            onFilterChange={setFilters}
            initialFilters={filters}
          />
        </div>

        {/* Items Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : items && items.length > 0 ? (
            <>
              <p className="text-white/70 mb-4">
                {items.length}件の商品が見つかりました
              </p>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                {items.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-white/50 py-16">
              商品が見つかりませんでした
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
