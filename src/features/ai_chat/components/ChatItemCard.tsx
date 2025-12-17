'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Item } from '@/features/items/types';

interface ChatItemCardProps {
  item: Item;
  showPurchaseButton?: boolean;
}

export function ChatItemCard({ item, showPurchaseButton = false }: ChatItemCardProps) {
  const isAvailable = item.status === 'available' || item.status === 'active';

  return (
    <Link href={`/items/${item.id}`}>
      <div className="glass-card rounded-2xl p-4 hover:glass-card-hover transition-all duration-300 cursor-pointer">
        <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-white/5">
          {item.images && item.images[0] ? (
            <Image
              src={item.images[0]}
              alt={item.title}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/40 text-sm">画像なし</span>
            </div>
          )}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="glass-badge bg-white/10 text-white text-xs font-medium">
                売り切れ
              </span>
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-white mb-2 line-clamp-2 text-sm">
          {item.title}
        </h3>
        
        <p className="text-xl font-bold text-blue-300 mb-2">
          ¥{item.price.toLocaleString()}
        </p>
        
        <p className="text-xs text-white/50 mb-3">
          {item.sellerName}
        </p>

        {showPurchaseButton && isAvailable && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Handle purchase click
                window.location.href = `/items/${item.id}?purchase=true`;
              }}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              購入する
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}

