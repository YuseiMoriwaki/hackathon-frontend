import { ItemListPage } from '@/features/items';
import { Header } from '@/components/layouts';

export default function ItemsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ItemListPage />
      </main>
    </div>
  );
}

export const metadata = {
  title: '商品一覧 - フリマアプリ',
  description: '販売中の商品一覧を表示',
};

