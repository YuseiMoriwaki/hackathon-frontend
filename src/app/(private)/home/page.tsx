'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Header, Container } from '@/components/layouts';
import { Card, Button, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { useItems, ItemCard, SearchFilters } from '@/features/items';
import type { ItemFilters } from '@/features/items/types';

export default function HomePage() {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filters, setFilters] = useState<ItemFilters>({});
  const { items, isLoading } = useItems(filters);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Container className="py-8">
          {/* Collapsible Search Section */}
          <div className="mb-8">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="glass-button px-6 py-3 flex items-center gap-3 w-full md:w-auto justify-between md:justify-start"
            >
              <Search className="w-5 h-5" />
              <span className="font-medium">検索フィルター</span>
              {isSearchOpen ? (
                <ChevronUp className="w-5 h-5 ml-2" />
              ) : (
                <ChevronDown className="w-5 h-5 ml-2" />
              )}
            </button>

            {isSearchOpen && (
              <div className="mt-4 animate-fade-in">
                <SearchFilters filters={filters} onFilterChange={setFilters} />
              </div>
            )}
          </div>

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
    </div>
  );
}
