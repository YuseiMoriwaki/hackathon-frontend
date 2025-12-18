import { FavoritesPage } from '@/features/favorites';

export default function Favorites() {
  return (
    <main className="flex-1 pt-14 pb-24">
      <FavoritesPage />
    </main>
  );
}

export const metadata = {
  title: 'お気に入り - Delta',
  description: 'お気に入りの商品一覧',
};
