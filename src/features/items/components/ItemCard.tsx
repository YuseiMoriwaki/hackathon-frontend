'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Card } from '@/components/ui';
import type { Item } from '../types';
import { STATUS_LABELS } from '../constants';
import { useAuth } from '@/features/auth';
import { useFavorites, useAddFavorite, useRemoveFavorite } from '@/features/favorites';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const { user } = useAuth();
  const { favorites, mutate } = useFavorites(user?.id);
  const { addFavorite } = useAddFavorite(user?.id);
  const { removeFavorite } = useRemoveFavorite(user?.id);
  
  const isFavorited = favorites.includes(item.id);
  const isAvailable = item.status === 'active' || item.status === 'available';

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;

    try {
      if (isFavorited) {
        await removeFavorite(item.id);
      } else {
        await addFavorite(item.id);
      }
      // Refresh favorites list
      await mutate();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <Link href={`/items/${item.id}`}>
      <Card hover variant="glass" className="h-full transition-all duration-300 relative">
        {/* Favorite Button */}
        {user && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 z-10 p-2 rounded-full glass-card hover:scale-110 transition-transform duration-200"
            aria-label={isFavorited ? 'お気に入りから削除' : 'お気に入りに追加'}
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-white/70'
              }`}
            />
          </button>
        )}

        <div className="relative aspect-square mb-3 rounded-lg overflow-hidden">
          {item.images[0] ? (
            <Image
              src={item.images[0]}
              alt={item.title}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <span className="text-white/40">画像なし</span>
            </div>
          )}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="glass-badge bg-white/10 text-white font-bold text-lg">
                {STATUS_LABELS[item.status]}
              </span>
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-white mb-2 line-clamp-2">
          {item.title}
        </h3>
        
        <p className="text-2xl font-bold text-blue-300 mb-2">
          ¥{item.price}
        </p>
        
        <p className="text-sm text-white/50">
          {item.sellerName}
        </p>
      </Card>
    </Link>
  );
}
