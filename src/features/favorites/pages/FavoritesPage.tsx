'use client';

import { Container } from '@/components/layouts';
import { LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { useFavorites } from '../hooks/useFavorites';
import { useItems } from '@/features/items/hooks/useItems';
import { ItemCard } from '@/features/items/components/ItemCard';

export function FavoritesPage() {
  const { user } = useAuth();
  const { favorites, isLoading: isFavoritesLoading } = useFavorites(user?.id);
  const { items, isLoading: isItemsLoading } = useItems({});

  const isLoading = isFavoritesLoading || isItemsLoading;

  // Filter items based on favorites
  const favoriteItems = items?.filter(item => favorites.includes(item.id)) ?? [];

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold text-white mb-8">お気に入り</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : favoriteItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center text-white/50 py-16">
          お気に入りの商品はありません
        </div>
      )}
    </Container>
  );
}

