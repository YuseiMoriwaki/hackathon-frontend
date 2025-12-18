'use client';

import { useState } from 'react';
import { Container } from '@/components/layouts';
import { LoadingSpinner, SearchBar } from '@/components/ui';
import { ItemCard } from '../components/ItemCard';
import { SearchFilters } from '../components/SearchFilters';
import { useItems } from '../hooks/useItems';
import type { ItemFilters } from '../types';
import { SlidersHorizontal } from 'lucide-react';

export function ItemListPage() {
  const [filters, setFilters] = useState<ItemFilters>({ status: 'active' });
  const [searchValue, setSearchValue] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { items, isLoading, isError } = useItems(filters);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchValue }));
  };

  const handleFilterChange = (newFilters: ItemFilters) => {
    setFilters(newFilters);
    setIsFiltersOpen(false);
  };

  if (isError) {
    return (
      <Container className="py-8">
        <div className="text-center text-red-300">商品の読み込みに失敗しました</div>
      </Container>
    );
  }

  return (
    <>
      {/* Fixed Search Bar */}
      <div className="fixed top-[64px] left-0 right-0 z-30 bg-transparent border-white/10 px-4 md:px-6 py-3">
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

      <Container className="py-8 pt-20">
        <h1 className="text-3xl font-bold text-white mb-8">商品一覧</h1>

        {/* Items Grid */}
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : items && items.length > 0 ? (
            <>
              <p className="text-white/70 mb-4">{items.length}件の商品が見つかりました</p>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                {items.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-white/50 py-16">商品が見つかりませんでした</div>
          )}
        </div>
      </Container>
    </>
  );
}
