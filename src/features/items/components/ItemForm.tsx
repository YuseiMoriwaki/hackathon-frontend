'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button, Input, Textarea } from '@/components/ui';
import type { ItemFormData, Item, ItemCategory } from '../types';
import { ITEM_CATEGORIES } from '../constants';

interface ItemFormProps {
  initialData?: Item;
  onSubmit: (data: ItemFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ItemForm({ initialData, onSubmit, isLoading }: ItemFormProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    images: initialData?.images || [],
    category: initialData?.category || 'other',
  });
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.price) {
      setError('必須項目を入力してください');
      return;
    }

    if (formData.price <= 0) {
      setError('価格は0円より大きい値を入力してください');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信に失敗しました');
    }
  };

  const handleAddImage = () => {
    if (imageUrl && formData.images.length < 5) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm">
          {error}
        </div>
      )}

      <Input
        label="商品名"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        required
        placeholder="商品名を入力"
      />

      <Textarea
        label="商品説明"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        required
        rows={6}
        placeholder="商品の詳細を入力してください"
      />

      <Input
        type="number"
        label="価格（円）"
        value={formData.price}
        onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
        required
        min={1}
        placeholder="1000"
      />

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          カテゴリー
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ItemCategory }))}
          className="glass-input w-full px-4 py-2.5"
          required
        >
          {ITEM_CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          画像（最大5枚）
        </label>
        
        {formData.images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {formData.images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                <Image src={img} alt="" width={100} height={100} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors backdrop-blur-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {formData.images.length < 5 && (
          <div className="flex gap-2">
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="画像URLを入力"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddImage}
              variant="secondary"
              disabled={!imageUrl}
            >
              追加
            </Button>
          </div>
        )}
        <p className="text-sm text-white/50 mt-2">
          画像のURLを入力してください（例: https://placehold.co/400）
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isLoading}
      >
        {initialData ? '更新する' : '出品する'}
      </Button>
    </form>
  );
}
