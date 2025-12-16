import { FavoritesPage } from '@/features/favorites';
import { Header } from '@/components/layouts';

export default function Favorites() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-14 pb-24">
        <FavoritesPage />
      </main>
    </div>
  );
}

export const metadata = {
  title: 'お気に入り - Delta',
  description: 'お気に入りの商品一覧',
};

