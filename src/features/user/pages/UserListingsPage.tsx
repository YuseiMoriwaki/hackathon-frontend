'use client';

import { Container } from '@/components/layouts';
import { LoadingSpinner } from '@/components/ui';
import { ItemCard } from '@/features/items';
import { useUserListings } from '../hooks/useUserListings';

interface UserListingsPageProps {
  userId: string;
}

export function UserListingsPage({ userId }: UserListingsPageProps) {
  const { items, isLoading, isError } = useUserListings(userId);

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="py-8">
        <div className="text-center text-red-300">出品一覧の読み込みに失敗しました</div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold text-white mb-8 pl-12 md:pl-0">出品中の商品</h1>

      {items && items.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center text-white/50 py-16">出品中の商品はありません</div>
      )}
    </Container>
  );
}
