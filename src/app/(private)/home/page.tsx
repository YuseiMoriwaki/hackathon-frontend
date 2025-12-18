'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import { Container, BottomNav } from '@/components/layouts';
import { Button, LoadingSpinner, SearchBar } from '@/components/ui';
import { useItems, ItemCard, SearchFilters } from '@/features/items';
import type { ItemFilters } from '@/features/items/types';

export default function HomePage() {
  const [filters, setFilters] = useState<ItemFilters>({});
  const [searchValue, setSearchValue] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { items, isLoading } = useItems(filters);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchValue }));
  };

  const handleFilterChange = (newFilters: ItemFilters) => {
    setFilters(newFilters);
    setIsFiltersOpen(false);
  };

  return (
    <>
      
      {/* Fixed Search Bar */}
      <div className="fixed top-[64px] left-0 right-0 z-30 bg-transparent px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <SearchBar 
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            placeholder="商品名で検索..."
            className="flex-1"
          />
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`
              bg-white/4 backdrop-blur-sm 
              border border-black/10 
              px-4 py-3 rounded-full
              flex items-center gap-2
              transition-all duration-300
              shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]
              hover:shadow-[0_12px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.18)]
              hover:bg-white/10
              ${isFiltersOpen ? 'bg-white/10' : ''}
            `}
          >
            <SlidersHorizontal className="w-5 h-5 text-white" />
            <span className="text-white hidden sm:inline">絞り込み</span>
          </button>
        </div>
        
        {/* Collapsible Filters */}
        {isFiltersOpen && (
          <div className="max-w-7xl mx-auto mt-3">
            <SearchFilters
              onFilterChange={handleFilterChange}
              initialFilters={filters}
              currentSearch={searchValue}
            />
          </div>
        )}
      </div>

      <main className="flex-1 pt-36 pb-24">
        <Container className="py-8">
          {/* Items Grid */}
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : items && items.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                {items.slice(0, 8).map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center text-white/50 py-16">
                商品が見つかりませんでした
              </div>
            )}

            {items && items.length > 8 && (
              <div className="mt-8 text-center">
                <Link href="/items">
                  <Button variant="secondary">すべての商品を見る</Button>
                </Link>
              </div>
            )}
          </div>
        </Container>
      </main>
      
      <BottomNav />
    </>
  );
}
