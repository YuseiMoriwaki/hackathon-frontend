'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';
import { Button } from '@/components/ui';
import type { Item } from '../types';
import { STATUS_LABELS, ITEM_CATEGORIES } from '../constants';
import { useRecommendedItems } from '../hooks/useRecommendedItems';
import { ItemCard } from './ItemCard';

interface ItemDetailProps {
  item: Item;
  onPurchaseClick?: () => void;
  canEdit?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export function ItemDetail({
  item,
  onPurchaseClick,
  canEdit = false,
  onEditClick,
  onDeleteClick,
}: ItemDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const isAvailable = item.status === 'active' || item.status === 'available';
  console.log(item.status);
  const categoryLabel = ITEM_CATEGORIES.find(c => c.value === item.category)?.label;
  const { items: recommendedItems } = useRecommendedItems(item.id, item.category);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="max-w-md mx-auto lg:max-w-lg w-full">
          <div className="aspect-square mb-4 rounded-xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm">
            {item.images[selectedImage] ? (
              <Image
                src={item.images[selectedImage]}
                alt={item.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white/40">画像なし</span>
              </div>
            )}
          </div>

          {item.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? 'border-blue-400 scale-[1.05]'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-4">
            <span
              className={`glass-badge ${
                isAvailable
                  ? 'bg-green-500/20 text-green-300 border-green-500/30'
                  : 'bg-white/10 text-white/70 border-white/20'
              } border`}
            >
              {STATUS_LABELS[item.status]}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">{item.title}</h1>

          <div className="text-4xl font-bold text-blue-300 mb-6">¥{item.price}</div>

          <div className="glass-card p-4 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">カテゴリー</span>
              <span className="font-medium text-white">{categoryLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">出品日</span>
              <span className="font-medium text-white">
                {new Date(item.createdAt).toLocaleDateString('ja-JP')}
              </span>
            </div>
          </div>

          {canEdit ? (
            <div className="flex gap-3">
              <Button onClick={onEditClick} variant="primary" className="flex-1">
                編集
              </Button>
              <Button onClick={onDeleteClick} variant="danger" className="flex-1">
                削除
              </Button>
            </div>
          ) : (
            isAvailable &&
            onPurchaseClick && (
              <Button onClick={onPurchaseClick} variant="primary" size="lg" className="w-full">
                Buy
              </Button>
            )
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">商品説明</h2>
        <p className="text-white/70 whitespace-pre-wrap leading-relaxed">{item.description}</p>
      </div>

      {/* Seller Information */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">出品者情報</h2>
        <Link href={`/users/${item.sellerId}`}>
          <div className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-lg transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <User className="w-8 h-8 text-white/70" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">{item.sellerName}</p>
              <p className="text-sm text-white/50">プロフィールを見る →</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recommended Section */}
      {recommendedItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recommended</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recommendedItems.map(recommendedItem => (
              <ItemCard key={recommendedItem.id} item={recommendedItem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
