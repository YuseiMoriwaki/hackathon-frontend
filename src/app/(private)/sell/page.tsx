import { ItemFormPage } from '@/features/items';
import { Header } from '@/components/layouts';

export default function SellPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-14 pb-24">
        <ItemFormPage />
      </main>
    </div>
  );
}

export const metadata = {
  title: '商品を出品 - フリマアプリ',
  description: '新しい商品を出品',
};

