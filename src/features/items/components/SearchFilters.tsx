'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import type { ItemFilters } from '../types';
import { ITEM_CATEGORIES } from '../constants';

interface SearchFiltersProps {
  onFilterChange: (filters: ItemFilters) => void;
  initialFilters?: ItemFilters;
}

export function SearchFilters({ onFilterChange, initialFilters }: SearchFiltersProps) {
  const [filters, setFilters] = useState<ItemFilters>(initialFilters || {});

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="font-semibold text-white">絞り込み</h3>

      <Input
        type="text"
        label="キーワード検索"
        value={filters.search || ''}
        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        placeholder="商品名で検索"
      />

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          カテゴリー
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => setFilters(prev => ({ 
            ...prev, 
            category: e.target.value ? e.target.value as any : undefined 
          }))}
          className="glass-input w-full px-4 py-2.5"
        >
          <option value="">すべて</option>
          {ITEM_CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          label="最低価格"
          value={filters.minPrice || ''}
          onChange={(e) => setFilters(prev => ({ 
            ...prev, 
            minPrice: e.target.value ? Number(e.target.value) : undefined 
          }))}
          placeholder="0"
          min={0}
        />
        <Input
          type="number"
          label="最高価格"
          value={filters.maxPrice || ''}
          onChange={(e) => setFilters(prev => ({ 
            ...prev, 
            maxPrice: e.target.value ? Number(e.target.value) : undefined 
          }))}
          placeholder="100000"
          min={0}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          onClick={handleApply}
          variant="primary"
          className="flex-1"
        >
          適用
        </Button>
        <Button
          onClick={handleReset}
          variant="secondary"
        >
          クリア
        </Button>
      </div>
    </div>
  );
}
